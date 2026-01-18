import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        console.log("Order confirm API called")

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            typescript: true,
        })

        const { paymentIntentId } = await req.json()

        if (!paymentIntentId) {
            console.error("No paymentIntentId provided")
            return NextResponse.json({ error: "PaymentIntent ID is required" }, { status: 400 })
        }

        console.log("Retrieving payment intent:", paymentIntentId)

        // Verify with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        console.log("Payment intent status:", paymentIntent.status)

        if (paymentIntent.status !== "succeeded") {
            console.error("Payment not successful:", paymentIntent.status)
            return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
        }

        // Access D1 database through Cloudflare bindings
        const db = process.env.DB as any

        if (!db) {
            console.error("Database binding not available")
            return NextResponse.json({ error: "Database not available" }, { status: 500 })
        }

        // Get customer email from Payment Intent
        // Try multiple sources: receipt_email, charges data, or customer
        let email = paymentIntent.receipt_email

        // If no receipt_email, try to get from the charge
        if (!email && paymentIntent.latest_charge) {
            try {
                const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string)
                email = charge.billing_details?.email || charge.receipt_email
            } catch (err) {
                console.warn("Could not retrieve charge:", err)
            }
        }

        // If still no email, try customer object
        if (!email && paymentIntent.customer) {
            try {
                const customer = await stripe.customers.retrieve(paymentIntent.customer as string)
                if (customer && !customer.deleted) {
                    email = customer.email
                }
            } catch (err) {
                console.warn("Could not retrieve customer:", err)
            }
        }

        console.log("Captured email for order:", email)

        // Update order status and email
        try {
            const result = await db.prepare(
                "UPDATE Orders SET status = ?, customer_email = ? WHERE stripe_payment_intent_id = ?"
            ).bind('succeeded', email || 'No email provided', paymentIntentId).run()

            console.log("Database update result:", result)

            return NextResponse.json({ success: true, email })
        } catch (dbError) {
            console.error("Database update error:", dbError)
            return NextResponse.json({ error: "Database update failed", details: String(dbError) }, { status: 500 })
        }

    } catch (error) {
        console.error("Error confirming order:", error)
        return NextResponse.json({ error: "Failed to confirm order", details: String(error) }, { status: 500 })
    }
}
