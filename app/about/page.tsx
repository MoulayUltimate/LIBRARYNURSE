import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, ShieldCheck, Truck, Users, Award, MessageCircle } from "lucide-react"

export const metadata: Metadata = {
    title: "About NursLibrary | Nursing & Veterinary Reference Books",
    description:
        "NursLibrary curates evidence-based nursing and veterinary reference books for students and clinicians. Every order ships a physical book worldwide and includes instant digital PDF access.",
    alternates: { canonical: "/about" },
}

export default function AboutPage() {
    return (
        <main className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#e3fffe] via-white to-[#f2f4f6] border-b border-[#bdc9c8]">
                <div className="max-w-4xl mx-auto px-5 md:px-8 py-14 md:py-20">
                    <nav className="text-xs text-[#6e7979] mb-4" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-[#006565]">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-[#3e4949]">About</span>
                    </nav>
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#191c1e] leading-tight"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        Trusted clinical references, delivered to your door.
                    </h1>
                    <p
                        className="mt-5 text-base md:text-lg text-[#3e4949] max-w-3xl"
                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                    >
                        NursLibrary curates a carefully selected catalogue of nursing and veterinary reference books for students, new graduates, and working clinicians. Every order ships a physical book worldwide and includes instant digital PDF access — so you can start reading the day you order.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-4xl mx-auto px-5 md:px-8 py-12 md:py-16">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <div className="bg-white rounded-2xl border border-[#bdc9c8] shadow-teal-md p-6 md:p-8">
                        <h2
                            className="text-xl md:text-2xl font-bold text-[#191c1e] mb-3"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            Our mission
                        </h2>
                        <p className="text-[#3e4949] leading-relaxed">
                            Bring authoritative, evidence-based reference books within reach of every nurse, vet tech, and clinician — at a fair price, with fast worldwide shipping and an immediate digital backup for those moments you need the answer right now.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#bdc9c8] shadow-teal-md p-6 md:p-8">
                        <h2
                            className="text-xl md:text-2xl font-bold text-[#191c1e] mb-3"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            How we choose books
                        </h2>
                        <p className="text-[#3e4949] leading-relaxed">
                            We only stock titles written by practising clinicians or established academic publishers. Every book in our catalogue is checked for currency, clinical relevance, and accuracy before it goes on sale.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why us */}
            <section className="max-w-4xl mx-auto px-5 md:px-8 pb-12 md:pb-16">
                <h2
                    className="text-2xl md:text-3xl font-bold text-[#191c1e] mb-6 text-center"
                    style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                >
                    Why customers choose NursLibrary
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    {[
                        { icon: BookOpen, title: "Physical book + digital PDF", body: "Every order ships a real, printed book to your address — and you get the digital PDF immediately so you can start reading right away." },
                        { icon: Truck, title: "Worldwide shipping", body: "We ship to the US, Canada, UK, EU, Australia, and most countries. Tracking provided on every parcel." },
                        { icon: ShieldCheck, title: "Secure checkout", body: "Payments processed by Stripe with full encryption. We never see or store your card details." },
                        { icon: Award, title: "30-day money-back guarantee", body: "If your book arrives damaged or you change your mind, we make it right within 30 days." },
                        { icon: Users, title: "Built by people who care", body: "Our small team responds personally to every email within one business day, Monday–Friday." },
                        { icon: MessageCircle, title: "Human support", body: "Real humans on email — no chatbots, no scripted replies. Just answers." },
                    ].map(({ icon: Icon, title, body }) => (
                        <div key={title} className="bg-white rounded-2xl border border-[#bdc9c8] p-5 md:p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-[#e3fffe] text-[#006565] flex-shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#191c1e]">{title}</h3>
                                    <p className="text-sm text-[#3e4949] mt-1 leading-relaxed">{body}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats / trust */}
            <section className="bg-[#f7f9fb] border-t border-b border-[#bdc9c8]">
                <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p
                            className="text-2xl md:text-3xl font-bold text-[#006565]"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            10,000+
                        </p>
                        <p className="text-xs md:text-sm text-[#3e4949] mt-1">Books shipped to date</p>
                    </div>
                    <div>
                        <p
                            className="text-2xl md:text-3xl font-bold text-[#006565]"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            30+
                        </p>
                        <p className="text-xs md:text-sm text-[#3e4949] mt-1">Countries served</p>
                    </div>
                    <div>
                        <p
                            className="text-2xl md:text-3xl font-bold text-[#006565]"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            4.8/5
                        </p>
                        <p className="text-xs md:text-sm text-[#3e4949] mt-1">Average customer rating</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-5 md:px-8 py-12 md:py-16 text-center">
                <h2
                    className="text-2xl md:text-3xl font-bold text-[#191c1e] mb-3"
                    style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                >
                    Questions before you order?
                </h2>
                <p className="text-[#3e4949] mb-6">
                    Browse our <Link href="/faq" className="underline text-[#006565] font-medium">FAQ</Link> or write to us directly — we reply within one business day.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="px-6 py-3 bg-[#006565] text-white font-semibold rounded-lg hover:bg-[#008080] transition-colors">
                        Browse the catalogue
                    </Link>
                    <Link href="/contact" className="px-6 py-3 bg-white border border-[#006565] text-[#006565] font-semibold rounded-lg hover:bg-[#e3fffe] transition-colors">
                        Contact us
                    </Link>
                </div>
            </section>
        </main>
    )
}
