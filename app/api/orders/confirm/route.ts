import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            typescript: true,
        })

        const { paymentIntentId } = await req.json()

        if (!paymentIntentId) {
            return NextResponse.json({ error: "PaymentIntent ID is required" }, { status: 400 })
        }

        // Verify with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        if (paymentIntent.status !== "succeeded") {
            return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
        }

        const db = process.env.DB as any
        if (!db) {
            return NextResponse.json({ error: "Database not available" }, { status: 500 })
        }

        // Get customer email from Payment Intent
        // Try multiple sources: receipt_email, charges data, or customer
        let email = paymentIntent.receipt_email

        // If no receipt_email, try to get from the charge
        if (!email && paymentIntent.latest_charge) {
            const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string)
            email = charge.billing_details?.email || charge.receipt_email
        }

        // If still no email, try customer object
        if (!email && paymentIntent.customer) {
            const customer = await stripe.customers.retrieve(paymentIntent.customer as string)
            if (customer && !customer.deleted) {
                email = customer.email
            }
        }

        console.log("Captured email for order:", email)

        // Update order status and email
        await db.prepare(
            "UPDATE Orders SET status = 'succeeded', customer_email = ?, updated_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = ?"
        ).bind(email || 'No email provided', paymentIntentId).run()

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Error confirming order:", error)
        return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 })
    }
}
