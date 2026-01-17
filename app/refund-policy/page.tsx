import { Footer } from "@/components/footer"

export const metadata = {
  title: "Refund Policy - LibraryNurse",
  description: "Information about our refund and returns policy for digital eBooks.",
}

export default function RefundPolicy() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Refund Policy</h1>

            <p className="text-lg text-foreground/80 mb-6">
              <strong>Last Updated: January 2026</strong>
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Overview</h2>
              <p className="text-foreground/80 mb-4">
                We want you to be completely satisfied with your purchase from LibraryNurse. Our refund policy is
                designed to ensure a fair and transparent process for all customers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Refund Eligibility</h2>
              <p className="text-foreground/80 mb-4">
                Refunds are available within 30 days of the original purchase date. To be eligible for a refund:
              </p>
              <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                <li>The request must be submitted within 30 days of purchase</li>
                <li>The eBook has not been significantly accessed or distributed</li>
                <li>You must provide a valid reason for the refund request</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. How to Request a Refund</h2>
              <p className="text-foreground/80 mb-4">
                To request a refund, please contact our customer support team at:
              </p>
              <p className="text-foreground/80 mb-4">
                <strong>Email:</strong> contact@librarynurse.com
              </p>
              <p className="text-foreground/80 mb-4">
                Include your order number and the reason for your refund request. Our team will respond within 5-7
                business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Refund Processing</h2>
              <p className="text-foreground/80 mb-4">
                Once your refund request is approved, the refund will be processed to your original payment method
                within 5-10 business days. Please note that your bank may take an additional 1-3 business days to
                reflect the refund in your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Non-Refundable Items</h2>
              <p className="text-foreground/80 mb-4">The following purchases are not eligible for refunds:</p>
              <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                <li>Digital products that have been fully accessed or downloaded multiple times</li>
                <li>Products purchased during clearance or special promotional sales</li>
                <li>Purchases made more than 30 days ago</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">6. Disputes</h2>
              <p className="text-foreground/80 mb-4">
                If you have a dispute regarding a refund decision, you may appeal to our management team. Contact us at
                contact@librarynurse.com with detailed information about your case.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">7. Contact Us</h2>
              <p className="text-foreground/80">
                For questions about our refund policy, please contact us:
                <br />
                <strong>Email:</strong> contact@librarynurse.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
