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
import { Check, Minus, Plus, Trash2, ArrowLeft, CreditCard, ShoppingBag, Download, Mail, CheckCircle, Shield, FileText } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, updateQuantity, removeItem } = useCart()
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    nameOnCard: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState("")
  const [couponSuccess, setCouponSuccess] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")

  const subtotal = total
  const tax = (subtotal - discount) * 0.08
  const finalTotal = subtotal - discount + tax

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "NURS10") {
      setDiscount(subtotal * 0.1)
      setCouponError("")
      setCouponSuccess("Coupon applied! 10% off.")
    } else {
      setDiscount(0)
      setCouponError("Invalid coupon code")
      setCouponSuccess("")
    }
  }

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
          <div className="max-w-7xl mx-auto px-4 py-12">
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
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <Check className="w-4 h-4" />
              <span>Trusted by 10,000+ Medical Professionals</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Secure Checkout</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Complete your purchase securely and receive instant access to your premium medical eBooks.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Shopping Cart */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
                <Link href="/" className="text-sm font-medium text-primary hover:underline">
                  Continue shopping {">"}
                </Link>
              </div>

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total Price</div>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 items-center">
                      <div className="sm:col-span-6 flex gap-4">
                        <div className="relative w-20 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.author}</p>
                          <p className="text-xs text-muted-foreground mt-1">Format: PDF eBook</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:contents">
                        <div className="sm:col-span-3 flex sm:justify-center">
                          <div className="flex items-center border border-input rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-muted transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-3 flex items-center justify-end gap-4">
                          <span className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
                  <button onClick={clearCart} className="text-sm text-destructive hover:underline font-medium">
                    Clear all items
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-end gap-2">
                <div className="flex justify-between w-full sm:max-w-xs text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full sm:max-w-xs text-sm">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-bold text-foreground text-right">Free (Digital Delivery)</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between w-full sm:max-w-xs text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between w-full sm:max-w-xs text-xl font-bold mt-2 pt-2 border-t border-border">
                  <span>Total:</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Payment Details */}
            <div className="lg:col-span-5 lg:row-span-2">
              <Card className="p-8 sticky top-24 shadow-lg border-border/50">
                <h2 className="text-xl font-bold text-foreground mb-6">Payment Details</h2>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-foreground mb-3">Payment Method:</label>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'google' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-muted/50'}`}
                      onClick={() => setPaymentMethod('google')}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'google' ? 'border-primary' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'google' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="font-medium">Google Pay</span>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-muted/50'}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="doctor@example.com"
                      className="bg-background h-11"
                    />
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1.5 font-medium">
                      <Check className="w-3 h-3" />
                      Your download link will be sent here immediately.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name On Card</label>
                    <Input
                      type="text"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleChange}
                      required
                      placeholder="Enter name on card"
                      className="bg-background h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="bg-background h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Expiration Date</label>
                      <Input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="bg-background h-11"
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
                        maxLength={3}
                        className="bg-background h-11"
                      />
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="pt-4 border-t border-border">
                    <label className="block text-sm font-medium text-foreground mb-2">Discount Code</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-background h-11"
                      />
                      <Button variant="outline" onClick={handleApplyCoupon} type="button" className="h-11 px-6">Apply</Button>
                    </div>
                    {couponError && <p className="text-destructive text-xs mt-2">{couponError}</p>}
                    {couponSuccess && <p className="text-green-600 text-xs mt-2">{couponSuccess}</p>}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white mt-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing Securely..."
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Pay & Download Instantly</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">${finalTotal.toFixed(2)}</span>
                      </div>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>256-bit SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Money-Back Guarantee</span>
                    </div>
                  </div>
                </form>
              </Card>
            </div>

            {/* Info Sections (Moved for Mobile Layout) */}
            <div className="lg:col-span-7">
              {/* How You Receive Section */}
              <div className="pt-8 border-t border-border lg:border-t-0 lg:pt-0">
                <h2 className="text-xl font-bold text-foreground mb-6">How You Receive Your Product</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Digital Download */}
                  <Card className="p-6 border-2 border-primary/20 hover:border-primary transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Download className="text-primary" size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">Instant Digital Download</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Download immediately after purchase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">PDF format compatible with all devices</span>
                      </li>
                    </ul>
                  </Card>

                  {/* Email Delivery */}
                  <Card className="p-6 border-2 border-primary/20 hover:border-primary transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="text-primary" size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">Email Delivery</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Download link sent to your email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Link remains active for 30 days</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Trust Section */}
              <div className="mt-8 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">Why Choose NursLibrary?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-5 bg-muted/50 border-0">
                    <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                      <Shield size={18} className="text-primary" />
                      Secure & Private
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Your payment information is encrypted with 256-bit SSL technology. We never store your credit card details.
                    </p>
                  </Card>

                  <Card className="p-5 bg-muted/50 border-0">
                    <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                      <CheckCircle size={18} className="text-primary" />
                      Money-Back Guarantee
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      We offer a 30-day money-back guarantee. If you're not satisfied with your eBook, we'll refund your purchase.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
