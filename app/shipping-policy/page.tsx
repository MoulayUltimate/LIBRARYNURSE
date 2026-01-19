import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "Shipping Policy - NursLibrary",
    description: "Information about our digital delivery policy for eBooks.",
}

export default function ShippingPolicy() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
                <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="prose prose-invert max-w-none">
                        <h1 className="text-4xl font-bold mb-8 text-foreground">Shipping Policy</h1>

                        <p className="text-lg text-foreground/80 mb-6">
                            <strong>Last Updated: January 2026</strong>
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Digital Delivery Only</h2>
                            <p className="text-foreground/80 mb-4">
                                NursLibrary is a digital-only marketplace. We do not sell or ship physical products. All products available on our website are digital downloads (eBooks).
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Delivery Method</h2>
                            <p className="text-foreground/80 mb-4">
                                Upon successful payment, you will receive your eBook(s) via the following methods:
                            </p>
                            <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                                <li><strong>Instant Download:</strong> A download link will be available immediately on the order confirmation page.</li>
                                <li><strong>Email Delivery:</strong> An email containing the download link(s) will be sent to the email address provided during checkout. Please check your spam/junk folder if you do not see it in your inbox.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. Delivery Time</h2>
                            <p className="text-foreground/80 mb-4">
                                Delivery is instant. You should receive your download links within minutes of purchase. If you experience any delays, please contact our support team.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Download Limits</h2>
                            <p className="text-foreground/80 mb-4">
                                Your purchase includes lifetime access to the eBook. You can download the file multiple times for your personal use on different devices.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Troubleshooting</h2>
                            <p className="text-foreground/80 mb-4">
                                If you encounter any issues with downloading or opening your file:
                            </p>
                            <ul className="list-disc list-inside text-foreground/80 mb-4 space-y-2">
                                <li>Ensure you have a stable internet connection.</li>
                                <li>Check that your device has a PDF reader installed.</li>
                                <li>Contact us if the download link is broken or expired.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">6. Contact Us</h2>
                            <p className="text-foreground/80">
                                If you haven't received your eBook or need assistance, please contact us:
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
