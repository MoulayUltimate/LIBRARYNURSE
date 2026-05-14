import { NextResponse } from "next/server"
import Stripe from "stripe"
import { sendTelegramMessage } from "@/lib/telegram"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const secretKey = process.env.STRIPE_SECRET_KEY
        if (!secretKey) {
            console.error("Missing STRIPE_SECRET_KEY")
            return NextResponse.json(
                { error: "Stripe is not configured on the server." },
                { status: 500 }
            )
        }

        const { amount, items, email } = await req.json()

        if (typeof amount !== "number" || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        const stripe = new Stripe(secretKey, { typescript: true })

        // Stripe expects integer minor units (cents)
        const amountInCents = Math.round(amount * 100)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            receipt_email: email || undefined,
            description: "NursLibrary eBooks",
            metadata: {
                item_count: String(items?.length || 0),
            },
        })

        // Persist a pending Orders row keyed by the PaymentIntent id
        const db = process.env.DB as any
        if (db && paymentIntent.id) {
            try {
                const orderId = crypto.randomUUID()
                const itemsJson = JSON.stringify(items || [])
                await db
                    .prepare(
                        "INSERT INTO Orders (id, stripe_payment_intent_id, customer_email, amount, status, items) VALUES (?, ?, ?, ?, 'pending', ?)"
                    )
                    .bind(
                        orderId,
                        paymentIntent.id,
                        email || null,
                        amount,
                        itemsJson
                    )
                    .run()
            } catch (dbErr) {
                console.error("Stripe order insert failed:", dbErr)
                // Don't block checkout if logging fails
            }

            try {
                const message = `💳 *New Stripe Checkout Started!*\n\n📧 *Email:* \`${email || "Unknown"}\`\n💰 *Amount:* $${amount.toFixed(2)}\n📦 *Items:* ${items?.length || 0}\n\n_Waiting for payment..._`
                await sendTelegramMessage(message)
            } catch (err) {
                console.error("Telegram Error", err)
            }
        }

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        })
    } catch (error: any) {
        console.error("Error creating Stripe PaymentIntent:", error)
        return NextResponse.json(
            { error: "Failed to create payment intent", details: error.message || String(error) },
            { status: 500 }
        )
    }
}
