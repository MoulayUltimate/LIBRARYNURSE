import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
})

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { amount, paymentIntentId, items, currency = "usd" } = await req.json()

        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 })
        }

        let paymentIntent;

        if (paymentIntentId) {
            // Update existing PaymentIntent
            paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
                amount: Math.round(amount * 100),
            })
        } else {
            // Create a new PaymentIntent
            paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                automatic_payment_methods: {
                    enabled: true,
                },
            })
        }

        // Save pending order to D1
        const db = process.env.DB as any
        if (db) {
            const orderId = crypto.randomUUID()
            const itemsJson = JSON.stringify(items || [])

            // Check if order exists for this payment intent
            const existingOrder = await db.prepare(
                "SELECT id FROM Orders WHERE stripe_payment_intent_id = ?"
            ).bind(paymentIntent.id).first()

            if (existingOrder) {
                // Update existing order
                await db.prepare(
                    "UPDATE Orders SET amount = ?, items = ?, updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = ?"
                ).bind(amount, itemsJson, paymentIntent.id).run()
            } else {
                // Create new pending order
                await db.prepare(
                    "INSERT INTO Orders (id, stripe_payment_intent_id, amount, status, items) VALUES (?, ?, ?, 'pending', ?)"
                ).bind(orderId, paymentIntent.id, amount, itemsJson).run()
            }
        }

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        })
    } catch (error) {
        console.error("Internal Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
