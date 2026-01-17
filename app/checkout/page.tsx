"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const subtotal = total
  const tax = subtotal * 0.08
  const finalTotal = subtotal + tax

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)

      console.log("[Email] Sending order confirmation to:", formData.email)
      console.log("[Email] Order Details:", {
        email: formData.email,
        fullName: formData.fullName,
        items: items,
        total: finalTotal,
        timestamp: new Date().toISOString(),
      })

      const order = {
        id: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        items: items,
        total: finalTotal,
        email: formData.email,
        createdAt: new Date(),
      }

      console.log("[Order] Order created:", order)

      clearCart()
      setTimeout(() => {
        router.push("/order-confirmation")
      }, 2000)
    }, 2000)
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <Card className="p-12 text-center">
              <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (orderComplete) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <Card className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground">Your order has been processed. Redirecting to confirmation...</p>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase and receive instant access to your eBooks</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Order Items Summary */}
              <Card className="p-6 mb-6 bg-muted/30 border-muted">
                <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="bg-input"
                    />
                    <p className="text-xs text-muted-foreground mt-1">You'll receive your download link here</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="bg-input"
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Payment Method</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      placeholder="4532 1234 5678 9010"
                      maxLength="19"
                      className="bg-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                      <Input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                        maxLength="5"
                        className="bg-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                      <Input
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleChange}
                        required
                        placeholder="123"
                        maxLength="3"
                        className="bg-input"
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-6" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Complete Purchase - $${finalTotal.toFixed(2)}`}
                  </Button>
                </form>
              </Card>
            </div>

            <div>
              <Card className="p-6 sticky top-20 border-accent/20">
                <h3 className="text-lg font-bold text-foreground mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-lg font-bold text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Informational section */}
                <div className="bg-accent/10 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Instant Download</p>
                      <p className="text-xs text-muted-foreground">Access immediately after purchase</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Email Backup</p>
                      <p className="text-xs text-muted-foreground">Download link sent to your email</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Secure Payment</p>
                      <p className="text-xs text-muted-foreground">SSL encrypted transactions</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
