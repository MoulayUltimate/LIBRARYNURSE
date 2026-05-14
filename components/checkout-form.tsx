"use client"

import { useEffect, useState } from "react"
import {
    PaymentElement,
    LinkAuthenticationElement,
    ExpressCheckoutElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { trackEvent } from "@/components/analytics-tracker"

interface CartItem {
    id: string | number
    title: string
    price: number
    quantity: number
}

interface CheckoutFormProps {
    amount: number
    items?: CartItem[]
    onSuccess?: () => void
}

export function CheckoutForm({ amount, items = [] }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Track checkout start (UI mount), but no PaymentIntent is created yet
        trackEvent("checkout_start", { amount })
    }, [amount])

    // Create the PaymentIntent only at submit time, then confirm.
    // This avoids polluting the Stripe dashboard with "Incomplete" intents
    // from users who land on /checkout but never click pay.
    async function createIntentAndConfirm(returnUrl: string) {
        if (!stripe || !elements) {
            return { error: { message: "Payment is still initializing. Try again." } as any }
        }

        // 1. Validate the Elements client-side first.
        const { error: submitError } = await elements.submit()
        if (submitError) {
            return { error: submitError }
        }

        // 2. Ask the server for a fresh PaymentIntent.
        const res = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: Number(amount.toFixed(2)),
                items: items.map((it) => ({
                    id: it.id,
                    title: it.title,
                    price: it.price,
                    quantity: it.quantity,
                })),
                email: email || null,
            }),
        })

        if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            return { error: { message: body?.error || "Could not initialize payment." } as any }
        }

        const { clientSecret } = await res.json()
        if (!clientSecret) {
            return { error: { message: "Missing client secret from server." } as any }
        }

        // 3. Confirm the payment with the freshly-minted secret.
        return stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: returnUrl,
                receipt_email: email || undefined,
            },
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setIsLoading(true)
        setMessage(null)

        const result = await createIntentAndConfirm(
            `${window.location.origin}/order-confirmation`
        )

        if (result?.error) {
            setMessage(result.error.message || "An unexpected error occurred.")
        }

        setIsLoading(false)
    }

    const onExpressCheckoutConfirm = async () => {
        if (!stripe || !elements) return

        const result = await createIntentAndConfirm(
            `${window.location.origin}/order-confirmation`
        )

        if (result?.error) {
            setMessage(result.error.message || "An unexpected error occurred.")
        }
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Express Checkout: Apple Pay, Google Pay */}
            <div>
                <ExpressCheckoutElement
                    onConfirm={onExpressCheckoutConfirm}
                    options={{
                        buttonType: {
                            applePay: "buy",
                            googlePay: "buy",
                        },
                    }}
                />
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or pay with card</span>
                </div>
            </div>

            <div>
                <LinkAuthenticationElement
                    id="link-authentication-element"
                    onChange={(e) => setEmail(e.value.email)}
                />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <span className="text-[#006565] font-medium">Important:</span> Your eBook download link will be sent to this email immediately.
                </p>
            </div>
            <PaymentElement
                id="payment-element"
                options={{
                    layout: "tabs",
                    wallets: {
                        applePay: "auto",
                        googlePay: "auto",
                    },
                }}
            />

            {/* Show any error or success messages */}
            {message && (
                <div id="payment-message" className="text-sm text-destructive font-medium">
                    {message}
                </div>
            )}

            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full h-14 text-lg font-bold bg-[#006565] hover:bg-[#008080] text-white mt-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Securely...
                    </>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <span>Pay & Download Instantly</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">${amount.toFixed(2)}</span>
                    </div>
                )}
            </Button>
        </form>
    )
}
