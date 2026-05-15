"use client"

import type React from "react"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Download,
  Mail,
  Lock,
  ShieldCheck,
  Zap,
  RotateCcw,
  Tag,
  ChevronDown,
  Star,
} from "lucide-react"
import Image from "next/image"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { trackEvent } from "@/components/analytics-tracker"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CheckoutForm } from "@/components/checkout-form"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, updateQuantity, removeItem } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState("")
  const [couponSuccess, setCouponSuccess] = useState("")
  const [couponOpen, setCouponOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
  const [payError, setPayError] = useState<string | null>(null)

  const subtotal = total
  const finalTotal = Math.max(subtotal - discount, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
    currency: "USD",
    intent: "capture",
  }

  const applyNurs10 = () => {
    setCouponCode("NURS10")
    setDiscount(subtotal * 0.1)
    setCouponError("")
    setCouponSuccess("NURS10 applied — 10% off")
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "NURS10") {
      setDiscount(subtotal * 0.1)
      setCouponError("")
      setCouponSuccess("NURS10 applied — 10% off")
    } else {
      setDiscount(0)
      setCouponError("That code didn't work — try NURS10 for 10% off")
      setCouponSuccess("")
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f9fb]">
        <div className="max-w-2xl mx-auto px-5 py-24 text-center">
          <div className="w-16 h-16 mx-auto bg-[#e3fffe] rounded-full flex items-center justify-center mb-6">
            <Download className="w-7 h-7 text-[#006565]" />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#191c1e] mb-3"
            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
          >
            Your cart is empty
          </h1>
          <p className="text-[#3e4949] mb-8">Find your next eBook in the library.</p>
          <Link href="/">
            <Button className="bg-[#006565] hover:bg-[#008080] text-white h-12 px-8 rounded-full font-semibold">
              Browse the library
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      {/* Top trust strip */}
      <div className="bg-white border-b border-[#bdc9c8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-[#3e4949]">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#006565]" />
            <span className="font-medium">256-bit SSL Encrypted</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-[#bdc9c8]" />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#006565]" />
            <span className="font-medium">Instant PDF download</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-[#bdc9c8]" />
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-[#006565]" />
            <span className="font-medium">30-day money-back guarantee</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-14">
        {/* Heading */}
        <div className="mb-8 md:mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006565] mb-2"
            style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
          >
            Secure Checkout
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#191c1e] leading-tight"
            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
          >
            One step away from your eBooks.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT — Payment (col-span-7) */}
          <section className="lg:col-span-7 space-y-6">
            {/* Express + Card */}
            <div className="bg-white rounded-2xl border border-[#bdc9c8] shadow-sm overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-[#bdc9c8] flex items-center justify-between">
                <h2
                  className="text-lg md:text-xl font-bold text-[#191c1e]"
                  style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                >
                  Payment details
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#006565] font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  Secure
                </div>
              </div>

              {/* Method toggle */}
              <div className="px-6 md:px-8 pt-6">
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#f2f4f6] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                      paymentMethod === "card"
                        ? "bg-white text-[#006565] shadow-sm"
                        : "text-[#56656e] hover:text-[#006565]"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                      paymentMethod === "paypal"
                        ? "bg-white text-[#006565] shadow-sm"
                        : "text-[#56656e] hover:text-[#006565]"
                    }`}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {/* Payment body */}
              <div className="px-6 md:px-8 py-6">
                {payError && (
                  <div className="text-sm text-[#ba1a1a] bg-[#ba1a1a]/8 border border-[#ba1a1a]/20 rounded-lg p-3 mb-4">
                    {payError}
                  </div>
                )}

                {paymentMethod === "card" ? (
                  !stripePromise ? (
                    <div className="text-sm text-[#56656e] text-center py-8">
                      Card payments are not configured. Please use PayPal.
                    </div>
                  ) : (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        mode: "payment",
                        amount: Math.round(Math.max(finalTotal, 0.5) * 100),
                        currency: "usd",
                        paymentMethodCreation: "manual",
                        appearance: {
                          theme: "stripe",
                          variables: {
                            colorPrimary: "#006565",
                            colorBackground: "#ffffff",
                            colorText: "#191c1e",
                            colorDanger: "#ba1a1a",
                            fontFamily: "Inter, system-ui, sans-serif",
                            spacingUnit: "4px",
                            borderRadius: "10px",
                          },
                        },
                      }}
                    >
                      <CheckoutForm amount={finalTotal} items={items} />
                    </Elements>
                  )
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-[#3e4949] text-center">
                      You'll be redirected to PayPal to complete your purchase securely.
                    </p>
                    <PayPalScriptProvider options={paypalOptions}>
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "gold",
                          shape: "rect",
                          label: "paypal",
                          height: 48,
                          tagline: false,
                        }}
                        createOrder={async () => {
                          try {
                            setPayError(null)
                            const response = await fetch("/api/paypal/create-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                amount: finalTotal,
                                email: null,
                                items: items.map((it) => ({
                                  id: it.id,
                                  title: it.title,
                                  price: it.price,
                                  quantity: it.quantity,
                                })),
                              }),
                            })
                            const orderData = await response.json()
                            if (orderData.id) return orderData.id
                            throw new Error("Could not initiate PayPal checkout")
                          } catch (err) {
                            console.error("PayPal Create Order Error:", err)
                            setPayError("Could not initiate checkout. Please try again.")
                            throw err
                          }
                        }}
                        onApprove={async (data) => {
                          try {
                            const response = await fetch("/api/paypal/capture-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ orderID: data.orderID }),
                            })
                            const orderData = await response.json()
                            if (orderData.status === "COMPLETED") {
                              trackEvent("purchase", {
                                transaction_id: String(orderData.id),
                                value: finalTotal,
                                currency: "USD",
                              })
                              clearCart()
                              router.push("/order-confirmation")
                            } else {
                              throw new Error("Payment not completed")
                            }
                          } catch (err) {
                            console.error("PayPal Capture Error:", err)
                            setPayError("Payment failed. Please try again.")
                          }
                        }}
                        onError={(err) => {
                          console.error("PayPal Error:", err)
                          setPayError("An error occurred with PayPal.")
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
              </div>

              {/* Payment footer trust */}
              <div className="px-6 md:px-8 py-4 border-t border-[#bdc9c8] bg-[#f7f9fb] flex flex-wrap items-center justify-between gap-3 text-xs text-[#56656e]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006565]" />
                  <span className="font-medium">We never store your card details</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Powered by</span>
                  <span className="font-semibold text-[#3e4949]">Stripe</span>
                  <span>+</span>
                  <span className="font-semibold text-[#3e4949]">PayPal</span>
                </div>
              </div>
            </div>

            {/* What you get */}
            <div className="bg-white rounded-2xl border border-[#bdc9c8] p-6 md:p-8">
              <h3
                className="text-base md:text-lg font-bold text-[#191c1e] mb-4"
                style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
              >
                What happens after you pay
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Step
                  icon={<Zap className="w-5 h-5" />}
                  title="Instant download"
                  body="Your PDF is ready the moment payment clears — no waiting."
                />
                <Step
                  icon={<Mail className="w-5 h-5" />}
                  title="Email backup"
                  body="A secure download link lands in your inbox, valid for 30 days."
                />
                <Step
                  icon={<RotateCcw className="w-5 h-5" />}
                  title="30-day refund"
                  body="Not what you expected? We'll refund you — no questions."
                />
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-gradient-to-br from-[#e3fffe] to-white border border-[#76d6d5]/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#006565] text-[#006565]" />
                ))}
                <span className="text-sm font-semibold text-[#191c1e] ml-1">4.9 / 5</span>
                <span className="text-xs text-[#56656e]">from 10,000+ professionals</span>
              </div>
              <blockquote
                className="text-sm md:text-base text-[#191c1e] italic leading-relaxed"
                style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
              >
                "The fastest checkout I've used for clinical resources. PDF was in my inbox before I closed the tab."
              </blockquote>
              <p className="text-xs text-[#56656e] mt-2 font-medium">
                — Dr. Sarah K., Veterinary Surgeon
              </p>
            </div>
          </section>

          {/* RIGHT — Order summary (col-span-5, sticky) */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-[#bdc9c8] shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#bdc9c8] flex items-center justify-between">
                  <h2
                    className="text-lg font-bold text-[#191c1e]"
                    style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                  >
                    Order summary
                  </h2>
                  <span className="text-xs font-semibold text-[#006565] bg-[#e3fffe] border border-[#76d6d5]/50 px-2.5 py-1 rounded-full">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items */}
                <ul className="divide-y divide-[#bdc9c8] max-h-[360px] overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.id} className="px-6 py-4 flex gap-3">
                      <div className="relative w-14 h-18 rounded-md overflow-hidden flex-shrink-0 border border-[#bdc9c8] bg-[#f2f4f6]">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        <span className="absolute -top-1 -right-1 bg-[#006565] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#191c1e] line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#56656e] mt-0.5">PDF eBook · Instant access</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-[#bdc9c8] rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-[#3e4949] hover:bg-[#f2f4f6] transition-colors disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-[#3e4949] hover:bg-[#f2f4f6] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#191c1e]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#56656e] hover:text-[#ba1a1a] transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Coupon */}
                <div className="px-6 py-4 border-t border-[#bdc9c8] bg-[#f7f9fb]">
                  {!couponSuccess ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setCouponOpen((v) => !v)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-[#006565] hover:text-[#008080] transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Have a discount code?
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${couponOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {couponOpen && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="bg-white h-10 text-sm"
                            />
                            <Button
                              variant="outline"
                              onClick={handleApplyCoupon}
                              type="button"
                              className="h-10 px-4 text-sm border-[#006565] text-[#006565] hover:bg-[#e3fffe]"
                            >
                              Apply
                            </Button>
                          </div>
                          {couponError && (
                            <p className="text-xs text-[#ba1a1a]">{couponError}</p>
                          )}
                          <button
                            type="button"
                            onClick={applyNurs10}
                            className="inline-flex items-center gap-1.5 text-xs text-[#006565] hover:text-[#008080] font-medium transition-colors"
                          >
                            <span className="inline-block px-1.5 py-0.5 rounded bg-[#e3fffe] border border-[#76d6d5]/50 font-mono tracking-wide">
                              NURS10
                            </span>
                            <span>— tap to apply 10% off</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#006565] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold text-[#006565]">{couponSuccess}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCouponCode("")
                          setDiscount(0)
                          setCouponSuccess("")
                          setCouponError("")
                        }}
                        className="text-xs text-[#56656e] hover:text-[#ba1a1a] font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="px-6 py-5 border-t border-[#bdc9c8] space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#56656e]">Subtotal</span>
                    <span className="font-semibold text-[#191c1e]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#56656e]">Delivery</span>
                    <span className="font-semibold text-[#006565]">Free · Instant</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#56656e]">Discount</span>
                      <span className="font-semibold text-[#006565]">−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-[#bdc9c8]">
                    <span
                      className="text-base font-bold text-[#191c1e]"
                      style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                      Total
                    </span>
                    <div className="flex items-baseline gap-2">
                      {discount > 0 && (
                        <span className="text-sm text-[#56656e] line-through">
                          ${subtotal.toFixed(2)}
                        </span>
                      )}
                      <span
                        className="text-2xl font-bold text-[#006565]"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                      >
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#56656e] pt-1">USD · taxes included</p>
                </div>
              </div>

              {/* Guarantee card */}
              <div className="bg-white rounded-2xl border border-[#bdc9c8] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e3fffe] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#006565]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191c1e] mb-1">
                    30-day money-back guarantee
                  </h3>
                  <p className="text-xs text-[#56656e] leading-relaxed">
                    If your eBook isn't a fit, just email us within 30 days and we'll refund every cent.
                  </p>
                </div>
              </div>

              {/* Clear all */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-xs text-[#56656e] hover:text-[#ba1a1a] font-medium transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-10 h-10 rounded-lg bg-[#e3fffe] border border-[#76d6d5]/50 text-[#006565] flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-[#191c1e]">{title}</h4>
      <p className="text-xs text-[#56656e] leading-relaxed">{body}</p>
    </div>
  )
}
