"use client"

import { useState } from "react"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"
import { trackEvent } from "@/components/analytics-tracker"
import { useCart } from "@/hooks/use-cart"

interface PayPalExpressButtonProps {
    product: any
    quantity?: number
    className?: string
}

export function PayPalExpressButton({ product, quantity = 1 }: PayPalExpressButtonProps) {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { clearCart } = useCart()

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
        currency: "USD",
        intent: "capture",
    }

    return (
        <div className="w-full relative z-0">
            <PayPalScriptProvider options={initialOptions}>
                {error && (
                    <div className="text-destructive text-sm text-center mb-2 bg-destructive/10 p-2 rounded">
                        {error}
                    </div>
                )}
                <PayPalButtons
                    style={{
                        layout: "horizontal",
                        color: "gold",
                        shape: "rect",
                        label: "buynow",
                        height: 48,
                        tagline: false
                    }}
                    createOrder={async (data, actions) => {
                        try {
                            const response = await fetch("/api/paypal/create-order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    amount: product.price * quantity,
                                    email: null, // Email will be captured from PayPal
                                    items: [{
                                        id: product.id,
                                        title: product.title,
                                        price: product.price,
                                        quantity: quantity,
                                    }],
                                }),
                            })

                            const orderData = await response.json()

                            if (orderData.id) {
                                return orderData.id
                            } else {
                                throw new Error("Could not initiate PayPal checkout")
                            }
                        } catch (err) {
                            console.error("PayPal Create Order Error:", err)
                            setError("Could not initiate checkout. Please try again.")
                            throw err
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            const response = await fetch("/api/paypal/capture-order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    orderID: data.orderID
                                }),
                            })

                            const orderData = await response.json()

                            if (orderData.status === "COMPLETED") {
                                trackEvent("purchase", {
                                    transaction_id: String(orderData.id), // Ensure string
                                    value: product.price * quantity,
                                    currency: "USD"
                                })
                                // Optional: Clear cart if we want to treat this as a "session" purchase
                                // For now, we won't clear the cart as this might be orthogonal transactions
                                // clearCart() 
                                router.push("/order-confirmation")
                            } else {
                                throw new Error("Payment not completed")
                            }
                        } catch (err) {
                            console.error("PayPal Capture Error:", err)
                            setError("Payment failed. Please try again.")
                        }
                    }}
                    onError={(err) => {
                        console.error("PayPal Error:", err)
                        setError("An error occurred with PayPal.")
                    }}
                />
            </PayPalScriptProvider>
        </div>
    )
}
