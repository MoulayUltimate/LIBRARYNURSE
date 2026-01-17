"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Returns & Refunds Policy</h1>
          <p className="text-foreground/60">Last updated: January 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <p className="text-foreground/80 leading-relaxed">
              At NursLibrary, we're committed to customer satisfaction. Our returns and refunds policy ensures you have
              peace of mind when purchasing digital nursing and medical eBooks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Return Eligibility</h2>
            <ul className="list-disc list-inside text-foreground/80 space-y-2">
              <li>Refunds are available within 30 days of purchase</li>
              <li>Product must not have been downloaded more than twice</li>
              <li>Original purchase receipt must be provided</li>
              <li>Refunds apply only to the full purchase price, excluding any taxes or shipping</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How to Request a Return</h2>
            <ol className="list-decimal list-inside text-foreground/80 space-y-2">
              <li>Contact our support team at contact@nurslibrary.com</li>
              <li>Provide your order number and product name</li>
              <li>Explain the reason for your return</li>
              <li>Our team will review and respond within 5 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Refund Processing</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Once your return is approved, the refund will be processed to your original payment method within 7-10
              business days. You will receive a confirmation email when your refund has been initiated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Non-Returnable Items</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">The following items are non-returnable:</p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2">
              <li>Products downloaded more than twice</li>
              <li>Products purchased more than 30 days ago</li>
              <li>Products purchased during promotional/clearance sales (non-refundable)</li>
              <li>Damaged or tampered files (unless due to our error)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Damaged or Defective Products</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you receive a damaged or defective eBook, please contact us immediately at contact@nurslibrary.com
              with details and screenshots. We will provide a replacement or full refund at no cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you have questions about our returns and refunds policy, please don't hesitate to contact our customer
              support team at <strong>contact@nurslibrary.com</strong> or call during business hours.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
