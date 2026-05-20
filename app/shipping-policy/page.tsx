import type { Metadata } from "next"
import { LegalPage, Section } from "@/components/legal-page"

export const metadata: Metadata = {
    title: "Shipping & Delivery Policy",
    description:
        "NursLibrary shipping policy: $19.55 flat-rate shipping to the United States, 4–12 business-day delivery, full tracking, and instant digital PDF access while you wait.",
    alternates: { canonical: "/shipping-policy" },
}

export default function ShippingPolicyPage() {
    return (
        <LegalPage
            title="Shipping & Delivery"
            subtitle="Physical books shipped across the United States, with instant digital PDF access while you wait."
            lastUpdated="May 15, 2026"
        >
            <Section title="1. What you receive">
                <p>Every order from NursLibrary includes:</p>
                <ul>
                    <li>A <strong>physical book</strong> shipped to your United States delivery address.</li>
                    <li><strong>Instant digital PDF access</strong>, so you can start reading immediately while your shipment is on the way.</li>
                </ul>
                <p>
                    Both formats are included in the listed price — there is no additional charge for the digital copy.
                </p>
            </Section>

            <Section title="2. Where we ship">
                <p>
                    We currently ship to the <strong>United States</strong> only (all 50 states, including Alaska and Hawaii). If you are outside the United States and would like to order, please email us before placing an order so we can confirm whether we can deliver to your country.
                </p>
            </Section>

            <Section title="3. Shipping cost">
                <p>
                    A flat shipping rate of <strong>$19.55 USD</strong> applies to all orders shipped within the United States. This is shown clearly at checkout and added to your order total.
                </p>
                <p>
                    Where a promotional free-shipping offer applies, it will be displayed on the relevant product page and reflected in your cart total.
                </p>
            </Section>

            <Section title="4. Processing times">
                <p>
                    Orders are processed within <strong>1–2 business days</strong> of payment confirmation. Orders placed on weekends or US public holidays are processed on the next business day.
                </p>
                <p>
                    You will receive an order-confirmation email immediately after purchase, followed by a shipping-confirmation email with tracking once the parcel leaves our fulfillment center.
                </p>
            </Section>

            <Section title="5. Delivery timeframe">
                <p>
                    Estimated delivery time for United States orders is <strong>4 to 12 business days</strong> from the date of dispatch, depending on destination ZIP code and carrier load.
                </p>
                <p>
                    These are courier estimates and may be affected by weather, peak-season volume, or other carrier delays beyond our control.
                </p>
            </Section>

            <Section title="6. Order tracking">
                <p>
                    Every shipment is dispatched with a tracking number. You will receive a tracking link by email as soon as the parcel is collected by the carrier. If you have not received tracking information within 3 business days of your order, please contact us.
                </p>
            </Section>

            <Section title="7. Taxes">
                <p>
                    Any sales tax that applies to your order is calculated and displayed at checkout based on your shipping address.
                </p>
            </Section>

            <Section title="8. Lost, stolen, or damaged shipments">
                <p>
                    If your tracking shows delivery but the parcel did not arrive, please check with neighbours and your local carrier first. If the parcel is not located within 5 business days, contact us and we will open a carrier claim on your behalf.
                </p>
                <p>
                    Books that arrive damaged are replaced at no cost — please email us within 7 days of delivery with photographs of the damaged item and packaging.
                </p>
            </Section>

            <Section title="9. Incorrect addresses">
                <p>
                    Please double-check your delivery address at checkout. Orders shipped to an incorrect address provided by the buyer are not eligible for free replacement. We can re-ship to the corrected address once the original parcel is returned to us; the buyer is responsible for reshipping costs.
                </p>
            </Section>

            <Section title="10. Digital PDF access">
                <p>
                    Your digital PDF is available immediately after payment and is sent to the email address on your order. The download link remains valid for 30 days. If you lose access, contact us and we will re-issue a fresh link at no charge.
                </p>
            </Section>

            <Section title="11. Contact">
                <p>
                    Shipping questions:<br />
                    Email: <a href="mailto:contact@nurslibrary.com">contact@nurslibrary.com</a><br />
                    Response time: within 1 business day, Monday–Friday.
                </p>
            </Section>
        </LegalPage>
    )
}
