import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Frequently Asked Questions",
    description:
        "Answers to the most common NursLibrary questions: physical book shipping, digital PDF access, delivery timeframes, returns, refunds, payment security, and international orders.",
    alternates: { canonical: "/faq" },
}

interface FaqItem {
    q: string
    a: string
}

const FAQS: { category: string; items: FaqItem[] }[] = [
    {
        category: "Your order",
        items: [
            {
                q: "Is this a real, physical book?",
                a: "Yes. Every order ships a printed, physical book to your delivery address. As a bonus, you also get instant digital PDF access so you can start reading while your parcel is in transit. Both formats are included in the listed price.",
            },
            {
                q: "How fast will my book arrive?",
                a: "Orders are processed within 1–2 business days. Estimated delivery within the United States is 4 to 12 business days from dispatch, depending on destination ZIP code and carrier load.",
            },
            {
                q: "How much is shipping?",
                a: "A flat shipping rate of $19.55 USD applies to all United States orders. The cost is shown clearly at checkout before you pay.",
            },
            {
                q: "Do you ship internationally?",
                a: "We currently ship to the United States only. If you are outside the United States and would like to order, please email Contact@nurslibrary.com before placing your order and we will confirm whether we can deliver to your country.",
            },
            {
                q: "How can I track my parcel?",
                a: "Every shipment includes a tracking number. You will receive a shipping-confirmation email with a tracking link as soon as your parcel is collected by the carrier.",
            },
            {
                q: "I never received my tracking email — what should I do?",
                a: "If you have not received tracking within 3 business days of ordering, please check your spam folder, then email Contact@nurslibrary.com with your order number and we will resend it.",
            },
        ],
    },
    {
        category: "Digital PDF access",
        items: [
            {
                q: "How does the digital copy work?",
                a: "Immediately after payment, we email a secure download link to the address on your order. The link remains valid for 30 days. If you lose access, just email us and we will reissue a fresh link at no charge.",
            },
            {
                q: "What format is the digital file?",
                a: "Standard PDF, readable on any computer, phone, or tablet. No special reader or app required.",
            },
            {
                q: "Can I return the book and keep the PDF?",
                a: "No. The digital PDF is bundled with the physical book. If you return the physical book for a refund, your digital access is also withdrawn.",
            },
        ],
    },
    {
        category: "Payment & security",
        items: [
            {
                q: "How do I pay?",
                a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) plus Apple Pay, Google Pay, and Link — all processed securely by Stripe. We never see or store your full card number.",
            },
            {
                q: "Is checkout secure?",
                a: "Yes. The entire site uses HTTPS encryption end-to-end, and payments are tokenised by Stripe — a PCI-DSS Level 1 certified payment processor used by millions of businesses worldwide.",
            },
            {
                q: "Will I be charged sales tax?",
                a: "Any applicable sales tax is calculated at checkout based on your United States shipping address and shown to you before payment.",
            },
        ],
    },
    {
        category: "Returns & refunds",
        items: [
            {
                q: "What is your return policy?",
                a: "You may return a physical book within 30 days of delivery for a full refund, provided the book is in original, resaleable condition. Email Contact@nurslibrary.com with your order number to start a return — full details on our Refund Policy page.",
            },
            {
                q: "Do I have to pay for return shipping?",
                a: "No — return shipping is free for all United States customers. We provide a prepaid return label or reimburse the carrier cost for any approved return.",
            },
            {
                q: "What if my book arrives damaged?",
                a: "We replace damaged books at no cost. Email us within 7 days of delivery with photographs of the book and packaging, and we will arrange a replacement.",
            },
            {
                q: "How long do refunds take?",
                a: "Once we receive and inspect the returned book (or confirm the qualifying issue), we issue the refund within 2 business days. Card networks typically post the credit within 5–10 business days.",
            },
            {
                q: "Can I cancel my order?",
                a: "If your order has not yet shipped, email us within 12 hours of placing it for a full refund. Once shipped, the standard return process applies.",
            },
        ],
    },
    {
        category: "Account & support",
        items: [
            {
                q: "Do I need to create an account to order?",
                a: "No — you can check out as a guest. All you need is an email address (to receive your order confirmation, PDF link, and tracking).",
            },
            {
                q: "How do I contact customer service?",
                a: "Email Contact@nurslibrary.com. We reply within 1 business day, Monday to Friday.",
            },
            {
                q: "Do you offer bulk or wholesale orders?",
                a: "Yes — please email us with the title(s), quantity, and shipping destination, and we will reply with pricing.",
            },
        ],
    },
]

// Generate JSON-LD for SEO-rich FAQ snippet
const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.flatMap((cat) =>
        cat.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
    ),
}

export default function FaqPage() {
    return (
        <main className="bg-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#e3fffe] via-white to-[#f2f4f6] border-b border-[#bdc9c8]">
                <div className="max-w-3xl mx-auto px-5 md:px-8 py-14 md:py-20">
                    <nav className="text-xs text-[#6e7979] mb-4" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-[#006565]">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-[#3e4949]">FAQ</span>
                    </nav>
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#191c1e] leading-tight"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        Frequently Asked Questions
                    </h1>
                    <p
                        className="mt-4 text-base md:text-lg text-[#3e4949]"
                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                    >
                        Everything you need to know about ordering, shipping, returns, and digital PDF access.
                    </p>
                </div>
            </section>

            <article className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
                {FAQS.map((cat) => (
                    <section key={cat.category} className="mb-12">
                        <h2
                            className="text-xl md:text-2xl font-bold text-[#191c1e] mb-4 pb-2 border-b border-[#bdc9c8]"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            {cat.category}
                        </h2>
                        <div className="space-y-4">
                            {cat.items.map((item) => (
                                <details key={item.q} className="group bg-white border border-[#bdc9c8] rounded-xl overflow-hidden">
                                    <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-[#f7f9fb] transition-colors">
                                        <span className="font-semibold text-[#191c1e]">{item.q}</span>
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e3fffe] text-[#006565] flex items-center justify-center text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                                    </summary>
                                    <div className="px-5 pb-5 text-[#3e4949] leading-relaxed border-t border-[#eceef0] pt-4">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                ))}

                <div className="mt-12 p-6 md:p-8 bg-[#f7f9fb] border border-[#bdc9c8] rounded-2xl text-center">
                    <h2
                        className="text-xl md:text-2xl font-bold text-[#191c1e] mb-2"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        Still have a question?
                    </h2>
                    <p className="text-[#3e4949] mb-4">Our team replies to every email within 1 business day.</p>
                    <Link href="/contact" className="inline-block px-6 py-3 bg-[#006565] text-white font-semibold rounded-lg hover:bg-[#008080] transition-colors">
                        Contact us
                    </Link>
                </div>
            </article>
        </main>
    )
}
