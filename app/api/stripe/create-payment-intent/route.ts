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

        const { amount, items, email, shipping } = await req.json()

        if (typeof amount !== "number" || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        // Shipping is required because we ship a physical book.
        if (
            !shipping ||
            !shipping.name ||
            !shipping.address?.line1 ||
            !shipping.address?.city ||
            !shipping.address?.state ||
            !shipping.address?.postal_code ||
            !shipping.address?.country
        ) {
            return NextResponse.json(
                { error: "A complete shipping address is required to ship your book." },
                { status: 400 }
            )
        }

        const stripe = new Stripe(secretKey, { typescript: true })

        // Stripe expects integer minor units (cents)
        const amountInCents = Math.round(amount * 100)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            receipt_email: email || undefined,
            description: "NursLibrary order (physical book + bonus PDF)",
            shipping: {
                name: shipping.name,
                phone: shipping.phone || undefined,
                address: {
                    line1: shipping.address.line1,
                    line2: shipping.address.line2 || undefined,
                    city: shipping.address.city,
                    state: shipping.address.state,
                    postal_code: shipping.address.postal_code,
                    country: shipping.address.country,
                },
            },
            metadata: {
                item_count: String(items?.length || 0),
                ship_to_name: shipping.name,
                ship_to_city: shipping.address.city,
                ship_to_state: shipping.address.state,
                ship_to_postal: shipping.address.postal_code,
                ship_to_country: shipping.address.country,
            },
        })

        // Persist a pending Orders row keyed by the PaymentIntent id
        const db = process.env.DB as any
        if (db && paymentIntent.id) {
            try {
                const orderId = crypto.randomUUID()
                const itemsJson = JSON.stringify(items || [])
                const shippingJson = JSON.stringify(shipping)
                try {
                    // Preferred path: dedicated shipping_address column (migration 0004)
                    await db
                        .prepare(
                            "INSERT INTO Orders (id, stripe_payment_intent_id, customer_email, amount, status, items, shipping_address) VALUES (?, ?, ?, ?, 'pending', ?, ?)"
                        )
                        .bind(
                            orderId,
                            paymentIntent.id,
                            email || null,
                            amount,
                            itemsJson,
                            shippingJson
                        )
                        .run()
                } catch (colErr) {
                    // Fallback if shipping_address column doesn't exist yet —
                    // stash the address inside the items JSON so it isn't lost.
                    const itemsWithShipping = JSON.stringify({
                        items: items || [],
                        shipping,
                    })
                    await db
                        .prepare(
                            "INSERT INTO Orders (id, stripe_payment_intent_id, customer_email, amount, status, items) VALUES (?, ?, ?, ?, 'pending', ?)"
                        )
                        .bind(
                            orderId,
                            paymentIntent.id,
                            email || null,
                            amount,
                            itemsWithShipping
                        )
                        .run()
                }
            } catch (dbErr) {
                console.error("Stripe order insert failed:", dbErr)
                // Don't block checkout if logging fails
            }

            try {
                const addrLine = `${shipping.address.line1}${shipping.address.line2 ? ", " + shipping.address.line2 : ""}, ${shipping.address.city}, ${shipping.address.state} ${shipping.address.postal_code}, ${shipping.address.country}`
                const message = `💳 *New Stripe Checkout Started!*\n\n📧 *Email:* \`${email || "Unknown"}\`\n💰 *Amount:* $${amount.toFixed(2)}\n📦 *Items:* ${items?.length || 0}\n\n🚚 *Ship to:* ${shipping.name}\n📍 ${addrLine}${shipping.phone ? `\n📞 ${shipping.phone}` : ""}\n\n_Waiting for payment..._`
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
