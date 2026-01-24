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
    const [email, setEmail] = useState("")
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

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-1 pl-1">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email to receive files"
                            className="w-full p-2 border rounded-md text-sm"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (message === "Please enter your email address first.") {
                                    setMessage(null);
                                }
                            }}
                        />
                        <p className="text-xs text-muted-foreground mt-1 pl-1">
                            We'll send your download link to this email.
                        </p>
                    </div>

                    <PayPalButtons
                        style={{
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "paypal"
                        }}
                        onCancel={() => {
                            setIsProcessing(false);
                            setMessage("Payment cancelled.");
                        }}
                        onClick={(data, actions) => {
                            if (!email || !email.includes('@')) {
                                setMessage("Please enter a valid email address first.");
                                return actions.reject();
                            }
                            return actions.resolve();
                        }}
                        createOrder={async (data, actions) => {
                            setIsProcessing(true);
                            // Reset message
                            setMessage(null);

                            try {
                                const response = await fetch("/api/paypal/create-order", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        amount: amount,
                                        email: email,
                                        items: items.map(item => ({
                                            id: item.id,
                                            title: item.title,
                                            price: item.price,
                                            quantity: item.quantity,
                                        })),
                                    }),
                                });

                                const orderData = await response.json();

                                if (orderData.error) {
                                    throw new Error(`${orderData.error}: ${orderData.details || ""}`);
                                }

                                if (orderData.id) {
                                    return orderData.id;
                                } else {
                                    const errorDetail = orderData?.details?.[0];
                                    const errorMessage = errorDetail
                                        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                        : JSON.stringify(orderData);

                                    throw new Error(errorMessage);
                                }
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

                                if (orderData.error) {
                                    throw new Error(`${orderData.error}: ${orderData.details || ""}`);
                                }

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
                            const errString = err?.toString() || JSON.stringify(err);
                            setMessage(`Error: ${errString}. Check console for details.`);
                        }}
                    />
                </div>

                {/* Show any error or success messages */}
                {message && (
                    <div id="payment-message" className={`text-sm font-bold text-center p-4 rounded-md ${message === "Payment successful!" ? "text-green-600 bg-green-100" : "text-destructive bg-destructive/10"
                        }`}>
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
