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

interface CheckoutFormProps {
    amount: number
    onSuccess?: () => void
}

export function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Track checkout start
        trackEvent("checkout_start", { amount })
    }, [amount])

    useEffect(() => {
        if (!stripe) {
            return
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        )

        if (!clientSecret) {
            return
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!")
                    break
                case "processing":
                    setMessage("Your payment is processing.")
                    break
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.")
                    break
                default:
                    setMessage("Something went wrong.")
                    break
            }
        })
    }, [stripe])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-confirmation`,
                receipt_email: email,
            },
        })

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.")
        } else {
            setMessage("An unexpected error occurred.")
        }

        setIsLoading(false)
    }

    const onExpressCheckoutConfirm = async () => {
        if (!stripe || !elements) return

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-confirmation`,
            },
        })

        if (error) {
            setMessage(error.message || "An unexpected error occurred.")
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
