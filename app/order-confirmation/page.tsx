"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Download, Mail, XCircle, Loader2 } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { trackEvent } from "@/components/analytics-tracker"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "processing" | "error">("loading")
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent")
    const redirectStatus = searchParams.get("redirect_status")

    // Stripe flow: a PaymentIntent param is always present after a real redirect.
    if (!paymentIntentId) {
      setStatus("error")
      return
    }

    if (redirectStatus && redirectStatus !== "succeeded") {
      setStatus("error")
      return
    }

    fetch("/api/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId }),
    })
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || "Confirmation failed")
        return data
      })
      .then(() => {
        trackEvent("purchase", {
          transaction_id: paymentIntentId,
          currency: "USD",
        })
        setStatus("success")
        setOrderId(paymentIntentId.slice(-10).toUpperCase())
      })
      .catch((err) => {
        console.error("Order confirmation failed:", err)
        setStatus("error")
      })
  }, [searchParams])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying your order...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <Card className="p-8 text-center mb-8">
        <div className="mb-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={40} className="text-destructive" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">Something went wrong with your payment.</p>
        <Link href="/checkout">
          <Button size="lg">Try Again</Button>
        </Link>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-8 text-center mb-8">
        <div className="mb-6">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-accent-foreground" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed</h1>
        <p className="text-muted-foreground mb-4">Thank you for your purchase!</p>
        <p className="text-lg font-semibold text-primary mb-6">Order ID: {orderId}</p>
      </Card>

      {/* What's next section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Download size={20} />
          Your bonus digital PDF
        </h2>
        <p className="text-muted-foreground mb-6">
          A secure PDF download link has been sent to the email on your order — you can start reading right away while your physical book is being prepared for dispatch.
        </p>
        <div className="space-y-3">
          <Button className="w-full" size="lg">
            Download PDF Copy
          </Button>
        </div>
      </Card>

      {/* Email Notification */}
      <Card className="p-6 mb-8 bg-muted">
        <div className="flex items-center gap-3 text-foreground">
          <Mail size={20} className="text-accent" />
          <div>
            <p className="font-semibold">Confirmation email sent</p>
            <p className="text-sm text-muted-foreground">
              Check your inbox for your order details, PDF download link, and shipping tracking once your book dispatches.
            </p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">What happens next</h2>
        <ol className="space-y-3 text-foreground">
          <li className="flex gap-3">
            <span className="font-bold text-primary">1</span>
            <span>Check your email — your bonus PDF download link is already there.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">2</span>
            <span>We prepare and ship your physical book within 1–2 business days.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">3</span>
            <span>You receive a shipping confirmation with a tracking number. US delivery: 4–12 business days.</span>
          </li>
        </ol>

        <div className="mt-8 flex gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/about" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </Card>
    </>
  )
}

export default function OrderConfirmationPage() {
  return (
    <>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }>
          <OrderConfirmationContent />
        </Suspense>
      </main>
    </>
  )
}
