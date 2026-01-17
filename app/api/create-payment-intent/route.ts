import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
})

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { amount, currency = "usd" } = await req.json()

        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 })
        }

        // Create a PaymentIntent with the specified amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
        console.error("Internal Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
