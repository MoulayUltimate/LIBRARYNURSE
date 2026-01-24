"use client"

import { useState } from "react"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { trackEvent } from "@/components/analytics-tracker"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

interface CheckoutFormProps {
    amount: number
    onSuccess?: () => void
}

export function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
    const [message, setMessage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()
    const { items, clearCart } = useCart()

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb", // sb = sandbox default
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium mb-4 text-center text-muted-foreground">Pay with PayPal or Credit/Debit Card</h3>

                    <PayPalButtons
                        style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "pay"
                        }}
                        createOrder={async (data, actions) => {
                            try {
                                setIsProcessing(true);
                                const response = await fetch("/api/paypal/create-order", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        amount: amount,
                                        items: items.map(item => ({
                                            id: item.id,
                                            title: item.title,
                                            price: item.price,
                                            quantity: item.quantity,
                                        })),
                                    }),
                                });

                                const orderData = await response.json();

                                if (orderData.id) {
                                    return orderData.id;
                                } else {
                                    const errorDetail = orderData?.details?.[0];
                                    const errorMessage = errorDetail
                                        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                        : JSON.stringify(orderData);

                                    throw new Error(errorMessage);
                                }
                            } catch (error) {
                                console.error(error);
                                setMessage(`Could not initiate PayPal Checkout: ${error}`);
                            } finally {
                                setIsProcessing(false);
                            }
                        }}
                        onApprove={async (data, actions) => {
                            try {
                                setIsProcessing(true);
                                const response = await fetch("/api/paypal/capture-order", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        orderID: data.orderID
                                    }),
                                });

                                const orderData = await response.json();
                                const errorDetail = orderData?.details?.[0];

                                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                    return actions.restart();
                                } else if (errorDetail) {
                                    throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                                } else {
                                    // Successful capture!
                                    console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
                                    trackEvent("purchase", {
                                        transaction_id: orderData.id,
                                        value: amount,
                                        currency: "USD"
                                    });
                                    setMessage("Payment successful!");
                                    clearCart();
                                    router.push("/order-confirmation");
                                }
                            } catch (error) {
                                console.error(error);
                                setMessage(`Sorry, your transaction could not be processed... ${error}`);
                            } finally {
                                setIsProcessing(false);
                            }
                        }}
                        onError={(err) => {
                            console.error("PayPal Checkout onError", err);
                            setMessage("An error occurred with PayPal checkout");
                        }}
                    />
                </div>

                {/* Show any error or success messages */}
                {message && (
                    <div id="payment-message" className="text-sm text-destructive font-medium text-center">
                        {message}
                    </div>
                )}

                <p className="text-xs text-muted-foreground mt-4 text-center">
                    By continuing, you agree to PayPal's terms of service.
                </p>
            </div>
        </PayPalScriptProvider>
    )
}
