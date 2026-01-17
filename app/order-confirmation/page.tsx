"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Download, Mail } from "lucide-react"

export default function OrderConfirmationPage() {
  const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      </main>
      <Footer />
    </>
  )
}
