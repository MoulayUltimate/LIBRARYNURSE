"use client"

import { useState } from "react"
import {
    Elements,
    ExpressCheckoutElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { trackEvent } from "@/components/analytics-tracker"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null

interface ExpressBuyButtonProps {
    product: {
        id: string | number
        title: string
        price: number
        image?: string
    }
    quantity?: number
}

/**
 * Single-product express checkout (Apple Pay / Google Pay / Link).
 *
 * Wraps Stripe Elements in deferred-intent mode so we don't create a
 * PaymentIntent on render. When the user taps an express button we mint
 * the intent server-side, then confirmPayment redirects to
 * /order-confirmation just like the full checkout flow.
 */
export function ExpressBuyButton({ product, quantity = 1 }: ExpressBuyButtonProps) {
    const amount = Math.max(product.price * quantity, 0.5)

    if (!stripePromise) return null

    return (
        <Elements
            stripe={stripePromise}
            options={{
                mode: "payment",
                amount: Math.round(amount * 100),
                currency: "usd",
                paymentMethodCreation: "manual",
                appearance: {
                    theme: "stripe",
                    variables: {
                        colorPrimary: "#006565",
                        borderRadius: "10px",
                    },
                },
            }}
        >
            <ExpressInner product={product} quantity={quantity} amount={amount} />
        </Elements>
    )
}

function ExpressInner({
    product,
    quantity,
    amount,
}: {
    product: ExpressBuyButtonProps["product"]
    quantity: number
    amount: number
}) {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    const onConfirm = async () => {
        if (!stripe || !elements) return

        const { error: submitError } = await elements.submit()
        if (submitError) {
            setError(submitError.message || "Payment failed to validate.")
            return
        }

        const res = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: Number(amount.toFixed(2)),
                items: [
                    {
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        quantity,
                    },
                ],
                email: null,
            }),
        })

        if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            setError(body?.error || "Could not initialize payment.")
            return
        }

        const { clientSecret } = await res.json()
        if (!clientSecret) {
            setError("Missing client secret from server.")
            return
        }

        trackEvent("begin_checkout", {
            productId: String(product.id),
            productTitle: product.title,
            value: amount,
            currency: "USD",
        })

        const result = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/order-confirmation`,
            },
        })

        if (result?.error) {
            setError(result.error.message || "Payment failed.")
        }
    }

    return (
        <div className="w-full">
            <ExpressCheckoutElement
                onConfirm={onConfirm}
                onReady={(e) => setReady(Boolean(e.availablePaymentMethods))}
                options={{
                    buttonType: {
                        applePay: "buy",
                        googlePay: "buy",
                    },
                    layout: { maxColumns: 1, maxRows: 3 },
                }}
            />
            {ready && (
                <p className="text-[11px] text-[#6e7979] text-center mt-2">
                    Pay securely · Apple Pay · Google Pay · Link
                </p>
            )}
            {error && (
                <p className="text-xs text-[#ba1a1a] text-center mt-2">{error}</p>
            )}
        </div>
    )
}
