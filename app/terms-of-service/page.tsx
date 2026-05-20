import type { Metadata } from "next"
import { LegalPage, Section } from "@/components/legal-page"

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "NursLibrary terms of service: governing law, eligible purchasers, physical book + bundled digital PDF licence, pricing, taxes, returns, and intellectual property.",
    alternates: { canonical: "/terms-of-service" },
}

export default function TermsOfServicePage() {
    return (
        <LegalPage
            title="Terms of Service"
            subtitle="The agreement between you and NursLibrary for purchases made through nurslibrary.com."
            lastUpdated="May 15, 2026"
        >
            <Section title="1. Acceptance of terms">
                <p>
                    By accessing nurslibrary.com or placing an order, you agree to these Terms of Service. If you do not agree, please do not use the site.
                </p>
            </Section>

            <Section title="2. Who we are">
                <p>
                    Nurs Library (trading as NursLibrary) is an online retailer of nursing and veterinary medical reference books. Every order includes a <strong>physical book shipped to your delivery address</strong> together with <strong>instant digital PDF access</strong> so you can begin reading while your parcel is in transit.
                </p>
                <p>
                    <strong>Registered business details:</strong><br />
                    Nurs Library<br />
                    7P64+R6J Abu Dhabi, Abu Dhabi 20000<br />
                    United Arab Emirates<br />
                    Email: <a href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a>
                </p>
            </Section>

            <Section title="3. Eligibility">
                <p>
                    You must be at least 18 years old (or the age of majority in your jurisdiction) to place an order. Our products are intended for adult students and licensed healthcare professionals.
                </p>
            </Section>

            <Section title="4. Products and orders">
                <ul>
                    <li>Product descriptions, page counts, and edition information are kept as accurate as possible.</li>
                    <li>Cover images are representative; minor design differences may occur between editions.</li>
                    <li>We reserve the right to limit order quantities or refuse any order at our discretion.</li>
                    <li>An order is accepted only when we send the order-confirmation email and successfully charge payment.</li>
                </ul>
            </Section>

            <Section title="5. Pricing, taxes, and payment">
                <p>
                    Prices are shown in the currency displayed at checkout and are exclusive of taxes and shipping unless stated otherwise. Final taxes (where applicable) and shipping are calculated at checkout.
                </p>
                <p>
                    Payments are processed securely by Stripe. We do not store full card numbers. By submitting payment, you authorise us to charge the order total to your selected payment method.
                </p>
            </Section>

            <Section title="6. Shipping and delivery">
                <p>
                    We ship physical books worldwide. Processing usually takes 1–2 business days; transit times depend on destination. See our <a href="/shipping-policy">Shipping Policy</a> for full details.
                </p>
            </Section>

            <Section title="7. Returns and refunds">
                <p>
                    Physical books may be returned within 30 days of delivery, subject to the conditions in our <a href="/refund-policy">Refund &amp; Returns Policy</a>. The bundled digital PDF is provided as a complimentary in-addition format and is not separately refundable once accessed.
                </p>
            </Section>

            <Section title="8. Intellectual property and licence">
                <p>
                    All books, PDFs, and content on this site are protected by copyright and other intellectual-property laws. We grant you a non-exclusive, non-transferable licence to read your purchased book and PDF for personal, educational use.
                </p>
                <p>You may not:</p>
                <ul>
                    <li>Resell, redistribute, or upload the PDF to any file-sharing platform.</li>
                    <li>Remove copyright notices or DRM where applied.</li>
                    <li>Modify or create derivative works for redistribution.</li>
                    <li>Use the materials for any commercial purpose beyond your personal practice or study.</li>
                </ul>
                <p>
                    Breach of this licence may result in termination of access and legal action.
                </p>
            </Section>

            <Section title="9. Acceptable use of the website">
                <p>You agree not to:</p>
                <ul>
                    <li>Attempt to gain unauthorised access to the site, servers, or other users&apos; accounts.</li>
                    <li>Use the site to transmit malware, spam, or unlawful content.</li>
                    <li>Use automated scrapers or bots to harvest content or pricing data.</li>
                    <li>Interfere with the normal operation of the site.</li>
                </ul>
            </Section>

            <Section title="10. Medical disclaimer">
                <p>
                    Our books are educational reference works and are not a substitute for professional medical advice, diagnosis, or treatment. Always follow your institution&apos;s protocols and consult qualified clinicians for individual patient decisions. NursLibrary is not liable for clinical decisions made on the basis of the content of any book sold.
                </p>
            </Section>

            <Section title="11. Limitation of liability">
                <p>
                    To the maximum extent permitted by law, NursLibrary&apos;s aggregate liability for any claim arising out of or related to your order is limited to the amount you paid for that order. We are not liable for indirect, incidental, consequential, or punitive damages.
                </p>
            </Section>

            <Section title="12. Indemnification">
                <p>
                    You agree to indemnify and hold NursLibrary harmless from any claim arising out of your breach of these Terms, your misuse of our content, or your violation of any law or third-party right.
                </p>
            </Section>

            <Section title="13. Changes to the Terms">
                <p>
                    We may update these Terms at any time. The &quot;Last updated&quot; date shows the current version. Continued use of the site after a change constitutes acceptance.
                </p>
            </Section>

            <Section title="14. Governing law">
                <p>
                    These Terms are governed by the laws of the United States, without regard to conflict-of-law principles. Disputes will be resolved in the courts of competent jurisdiction in the United States.
                </p>
            </Section>

            <Section title="15. Contact">
                <p>
                    Questions about these Terms:<br />
                    Email: <a href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a><br />
                    Response time: within 1 business day, Monday–Friday.
                </p>
            </Section>
        </LegalPage>
    )
}
