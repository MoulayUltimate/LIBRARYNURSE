import type { Metadata } from "next"
import { LegalPage, Section } from "@/components/legal-page"

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "NursLibrary privacy policy: how we collect, use, and protect personal data for physical book orders and bundled digital PDF access. GDPR and CCPA compliant.",
    alternates: { canonical: "/privacy-policy" },
}

export default function PrivacyPolicyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            subtitle="How we collect, use, and protect your personal information."
            lastUpdated="May 15, 2026"
        >
            <Section title="1. Introduction">
                <p>
                    NursLibrary (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This policy explains what information we collect when you visit our website or place an order for a physical book (with bundled digital PDF access), how we use that information, who we share it with, and the rights you have over it.
                </p>
                <p>
                    This policy is designed to meet the requirements of the EU General Data Protection Regulation (GDPR), the UK GDPR, and the California Consumer Privacy Act (CCPA).
                </p>
            </Section>

            <Section title="2. Who is the data controller">
                <p>
                    The data controller for personal data collected through nurslibrary.com is <strong>Nurs Library</strong>, 7P64+R6J Abu Dhabi, Abu Dhabi 20000, United Arab Emirates. You can reach us at <a href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a> for any privacy-related question.
                </p>
            </Section>

            <Section title="3. Information we collect">
                <p>We collect the following categories of personal data:</p>
                <ul>
                    <li><strong>Order &amp; shipping data</strong>: name, shipping address, billing address, email, phone (optional), and the items you ordered. Required to ship your physical book and send the digital PDF.</li>
                    <li><strong>Payment data</strong>: card payments are processed by Stripe. We do not see or store your full card number — Stripe returns only a token and the last 4 digits.</li>
                    <li><strong>Account &amp; communication data</strong>: emails you send us, support tickets, and replies.</li>
                    <li><strong>Technical data</strong>: IP address, browser type, device type, referring URL, pages visited, and timestamps. Collected via cookies and analytics tags.</li>
                    <li><strong>Marketing data</strong>: whether you opened our emails or clicked links (where applicable).</li>
                </ul>
            </Section>

            <Section title="4. How we use your information">
                <p>We use personal data only for clearly defined purposes:</p>
                <ul>
                    <li>To process your order, take payment, ship your physical book, and email your digital PDF link.</li>
                    <li>To send order-confirmation, shipping-confirmation, and delivery emails.</li>
                    <li>To respond to support requests, refund requests, and customer enquiries.</li>
                    <li>To detect and prevent fraud, chargebacks, and abuse.</li>
                    <li>To comply with tax, accounting, and consumer-protection laws.</li>
                    <li>To improve the website, measure marketing performance, and analyse aggregate traffic.</li>
                </ul>
            </Section>

            <Section title="5. Legal bases (GDPR)">
                <p>Where GDPR or UK GDPR applies, we rely on the following legal bases:</p>
                <ul>
                    <li><strong>Contract</strong> — to fulfil your order and deliver the book.</li>
                    <li><strong>Legal obligation</strong> — to keep accounting and tax records.</li>
                    <li><strong>Legitimate interests</strong> — to prevent fraud, secure the site, and analyse aggregate usage.</li>
                    <li><strong>Consent</strong> — for non-essential cookies and marketing emails. You can withdraw consent at any time.</li>
                </ul>
            </Section>

            <Section title="6. Who we share data with">
                <p>We share personal data only with vetted service providers who help us run the business:</p>
                <ul>
                    <li><strong>Stripe</strong> — payment processing and fraud prevention.</li>
                    <li><strong>Shipping carriers</strong> — to deliver your physical book (name, address, contact details).</li>
                    <li><strong>Cloudflare</strong> — hosting, DNS, and security.</li>
                    <li><strong>Google (Analytics &amp; Ads)</strong> — aggregated traffic measurement and conversion tracking.</li>
                    <li><strong>Email delivery providers</strong> — to send order confirmations and the digital PDF link.</li>
                </ul>
                <p>
                    We never sell your personal data. We do not share data with third parties for their own marketing.
                </p>
            </Section>

            <Section title="7. International data transfers">
                <p>
                    Some of our service providers are located outside your country (for example in the United States). Where data is transferred internationally, we rely on the EU Standard Contractual Clauses or equivalent safeguards.
                </p>
            </Section>

            <Section title="8. How long we keep your data">
                <ul>
                    <li><strong>Order records</strong>: 7 years (required for tax and accounting).</li>
                    <li><strong>Support emails</strong>: 3 years from the last contact.</li>
                    <li><strong>Marketing data</strong>: until you unsubscribe or 2 years of inactivity, whichever comes first.</li>
                    <li><strong>Analytics data</strong>: up to 14 months in aggregated form.</li>
                </ul>
            </Section>

            <Section title="9. Cookies and analytics">
                <p>
                    We use a small set of cookies and tags:
                </p>
                <ul>
                    <li><strong>Essential cookies</strong> — required for the cart, checkout, and login to work.</li>
                    <li><strong>Analytics (Google Analytics 4)</strong> — aggregated page-view and conversion metrics.</li>
                    <li><strong>Advertising (Google Ads)</strong> — measures the performance of our advertising campaigns.</li>
                </ul>
                <p>
                    You can disable cookies in your browser settings. Essential cookies cannot be disabled without breaking checkout.
                </p>
            </Section>

            <Section title="10. Your rights">
                <p>Depending on your country, you may have the right to:</p>
                <ul>
                    <li>Access the personal data we hold about you.</li>
                    <li>Correct inaccurate or incomplete data.</li>
                    <li>Request deletion of your data (subject to legal retention requirements).</li>
                    <li>Object to or restrict processing.</li>
                    <li>Withdraw consent for marketing at any time.</li>
                    <li>Request a copy of your data in a portable format.</li>
                    <li>Lodge a complaint with your local data-protection authority.</li>
                </ul>
                <p>
                    To exercise any of these rights, email <a href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a>. We respond within 30 days.
                </p>
            </Section>

            <Section title="11. Children">
                <p>
                    NursLibrary is intended for adults — primarily nursing students and licensed healthcare professionals. We do not knowingly collect data from children under 16. If you believe a child has provided us data, contact us and we will delete it.
                </p>
            </Section>

            <Section title="12. Security">
                <p>
                    We use HTTPS across the entire site, payment tokenization via Stripe, encrypted database storage, and access controls to protect your data. No method of transmission is 100% secure, but we apply industry-standard safeguards.
                </p>
            </Section>

            <Section title="13. Changes to this policy">
                <p>
                    We may update this policy from time to time. The &quot;Last updated&quot; date at the top of the page shows when it was last revised. Material changes will be announced on the site.
                </p>
            </Section>

            <Section title="14. Contact">
                <p>
                    Privacy questions or data requests:<br />
                    Email: <a href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a><br />
                    Response time: within 1 business day, Monday–Friday.
                </p>
            </Section>
        </LegalPage>
    )
}
