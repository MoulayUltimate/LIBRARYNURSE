import type { Metadata } from "next"
import { LegalPage, Section } from "@/components/legal-page"

export const metadata: Metadata = {
    title: "Refund & Returns Policy",
    description:
        "Nurs Library refund and returns policy: 30-day money-back guarantee on physical books and bundled digital PDF access, with free return shipping for United States customers.",
    alternates: { canonical: "/refund-policy" },
}

export default function RefundPolicyPage() {
    return (
        <LegalPage
            title="Refund & Returns Policy"
            subtitle="30-day money-back guarantee · Free returns for US customers."
            lastUpdated="May 15, 2026"
        >
            <Section title="1. Overview">
                <p>
                    At Nurs Library, every order includes a <strong>physical book shipped to your delivery address</strong> together with <strong>instant digital PDF access</strong> while you wait. This policy explains how returns and refunds work for both formats.
                </p>
                <p>
                    If you are not satisfied with your purchase for any reason, you may request a refund within <strong>30 days</strong> of the delivery date.
                </p>
            </Section>

            <Section title="2. Eligible reasons for refund">
                <ul>
                    <li>The physical book arrived damaged, defective, or incomplete.</li>
                    <li>The wrong title was shipped.</li>
                    <li>The shipment was not delivered within 30 days of the order being placed.</li>
                    <li>The book is not as described on the product page.</li>
                    <li>You changed your mind (subject to the return conditions below).</li>
                </ul>
            </Section>

            <Section title="3. Return conditions for physical books">
                <p>To be eligible for a full refund, returned books must be:</p>
                <ul>
                    <li>In their original condition (unmarked, no torn pages, no damage to the cover or spine).</li>
                    <li>Returned within <strong>30 days</strong> of the delivery date.</li>
                    <li>Accompanied by the order number or proof of purchase.</li>
                </ul>
                <p>
                    Books returned in a condition that prevents resale may be refunded at a reduced rate. We do not charge restocking fees.
                </p>
            </Section>

            <Section title="4. Digital PDF access">
                <p>
                    Because the digital PDF is delivered immediately upon payment, it is provided <strong>in addition to</strong> the physical book and is not separately refundable once accessed. If you choose to return the physical book, your digital access is also withdrawn.
                </p>
                <p>
                    If the digital file is corrupted, fails to download, or cannot be opened, contact us and we will replace it at no cost.
                </p>
            </Section>

            <Section title="5. How to request a return or refund">
                <p>
                    Email <a href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a> with:
                </p>
                <ul>
                    <li>Your order number</li>
                    <li>The reason for the return</li>
                    <li>Photographs of the book if it arrived damaged</li>
                </ul>
                <p>
                    We will respond within <strong>1 business day</strong> with return instructions and a return shipping address. Please do not ship items back before receiving authorization.
                </p>
            </Section>

            <Section title="6. Return shipping costs">
                <p>
                    <strong>Return shipping is free for all United States customers.</strong> We provide a prepaid return label or reimburse the carrier cost for any approved return, regardless of the reason (damaged, defective, wrong title, or change of mind).
                </p>
            </Section>

            <Section title="7. Refund processing time">
                <p>
                    Once we receive and inspect the returned book (or confirm the qualifying issue), we will issue the refund within <strong>2 business days</strong> to your original payment method. Card networks typically post the credit within <strong>5–10 business days</strong>.
                </p>
            </Section>

            <Section title="8. Non-refundable items">
                <ul>
                    <li>Promotional items provided free with a paid purchase.</li>
                    <li>Customised or personalised editions, where applicable.</li>
                    <li>Books returned after the 30-day window without prior agreement.</li>
                </ul>
            </Section>

            <Section title="9. Order cancellations">
                <p>
                    If your order has not yet shipped, you may cancel it for a full refund by emailing us within <strong>12 hours</strong> of placing the order. Once an order has shipped, the standard return process applies.
                </p>
            </Section>

            <Section title="10. Contact">
                <p>
                    For any questions about this policy:<br />
                    <strong>Nurs Library</strong><br />
                    7P64+R6J Abu Dhabi, Abu Dhabi 20000, United Arab Emirates<br />
                    Email: <a href="mailto:Contact@nurslibrary.com">Contact@nurslibrary.com</a><br />
                    Preferred contact method: Email<br />
                    Response time: within 1 business day, Monday–Friday.
                </p>
            </Section>
        </LegalPage>
    )
}
