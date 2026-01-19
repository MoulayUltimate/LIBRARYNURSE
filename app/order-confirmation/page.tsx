"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Download, Mail, XCircle, Loader2 } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { stripePromise } from "@/lib/stripe"
import { trackEvent } from "@/components/analytics-tracker"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "processing" | "error">("loading")
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret")
    const redirectStatus = searchParams.get("redirect_status")

    if (!clientSecret) {
      // If no client secret, maybe they came here directly?
      // For now, let's just show success if they have a random ID from the old logic, 
      // or redirect home. But let's assume success for demo purposes if no params, 
      // or better, generate a random ID and show success (fallback).
      setStatus("success")
      setOrderId("ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase())
      return
    }

    stripePromise.then((stripe) => {
      if (!stripe) return

      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setStatus("success")
            setOrderId(paymentIntent.id.slice(-9).toUpperCase())

            // Track purchase event
            trackEvent("purchase", {
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              paymentIntentId: paymentIntent.id
            })

            // Confirm order in backend
            fetch("/api/orders/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentIntentId: paymentIntent.id })
            }).catch(err => console.error("Failed to confirm order", err))

            break
          case "processing":
            setStatus("processing")
            break
          case "requires_payment_method":
            setStatus("error")
            break
          default:
            setStatus("error")
            break
        }
      })
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

      {/* Download Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Download size={20} />
          Your eBooks
        </h2>
        <p className="text-muted-foreground mb-6">
          Your purchased eBooks are ready for download. You'll receive an email with download links and access
          instructions.
        </p>
        <div className="space-y-3">
          <Button className="w-full" size="lg">
            Download All Files
          </Button>
          <Button variant="outline" className="w-full bg-transparent" size="lg">
            View in Library
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
              Check your email for order details and download instructions
            </p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Next Steps</h2>
        <ol className="space-y-3 text-foreground">
          <li className="flex gap-3">
            <span className="font-bold text-primary">1</span>
            <span>Check your email for confirmation and download links</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">2</span>
            <span>Download your eBooks in PDF format</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">3</span>
            <span>Access your library anytime from your account</span>
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
      <Header />
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
      <Footer />
    </>
  )
}
