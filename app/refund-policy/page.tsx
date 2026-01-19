import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "Refund Policy - NursLibrary",
    description: "Information about our refund and returns policy for digital eBooks.",
}

export default function RefundPolicy() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
                <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="prose prose-invert max-w-none">
                        <h1 className="text-4xl font-bold mb-8 text-foreground">Refund Policy</h1>

                        <p className="text-lg text-foreground/80 mb-6">
                            <strong>Last Updated: January 2026</strong>
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. 30-Day Money-Back Guarantee</h2>
                            <p className="text-foreground/80 mb-4">
                                We want you to be completely satisfied with your purchase from NursLibrary. We offer a <strong>30-day money-back guarantee</strong> on all our digital eBooks. If you are not satisfied with your purchase for any reason, you may request a full refund within 30 days of the purchase date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Eligibility for Refunds</h2>
                            <p className="text-foreground/80 mb-4">
                                To ensure a fair process, we ask that you meet the following simple criteria:
                            </p>
                            <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                                <li>The refund request is made within 30 days of the original purchase.</li>
                                <li>You have a valid order number or proof of purchase.</li>
                                <li>For duplicate purchases, we will refund the duplicate transaction immediately.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. How to Request a Refund</h2>
                            <p className="text-foreground/80 mb-4">
                                To initiate a refund, please contact our support team via email:
                            </p>
                            <p className="text-foreground/80 mb-4">
                                <strong>Email:</strong> contact@nurslibrary.com
                            </p>
                            <p className="text-foreground/80 mb-4">
                                Please include your <strong>Order Number</strong> and a brief explanation of why you are requesting a refund. This helps us improve our products and services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Processing Time</h2>
                            <p className="text-foreground/80 mb-4">
                                Once your refund is approved, it will be processed immediately. The funds will be returned to your original method of payment. Please allow <strong>5-10 business days</strong> for your bank or credit card issuer to process the refund and for it to appear on your statement.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Contact Us</h2>
                            <p className="text-foreground/80">
                                If you have any questions about our Refund Policy, please contact us at:
                                <br />
                                <strong>Email:</strong> contact@nurslibrary.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
