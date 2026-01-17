import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
})

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { amount, paymentIntentId, currency = "usd" } = await req.json()

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

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        })
    } catch (error) {
        console.error("Internal Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
