import { ProductGrid } from "@/components/product-grid"
import { getCollections } from "@/lib/store"
import {
    Download,
    Globe,
    Award,
    ArrowRight,
    ChevronDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BenefitsTicker } from "@/components/benefits-ticker"
import { HeroSection } from "@/components/hero-section"
import { TrustReviews } from "@/components/trust-reviews"
import type { Metadata } from "next"

export const runtime = "edge"

export const metadata: Metadata = {
    title: "Veterinary & Nursing Reference Books — Shipped with Bonus PDF",
    description:
        "Browse 500+ evidence-based veterinary and nursing reference books. Real, printed books shipped across the US with a complimentary digital PDF copy. Shop by specialty: surgery, pharmacology, dermatology, anatomy, and more.",
    alternates: { canonical: "/" },
}

async function getProducts() {
    try {
        const db = process.env.DB as any
        if (!db) return []
        const { results } = await db.prepare("SELECT * FROM Products WHERE draft IS NULL OR draft = 0").all()
        return results.map((p: any) => ({
            ...p,
            collections: p.collections ? JSON.parse(p.collections) : [],
            price: Number(p.price),
            pages: p.pages ? Number(p.pages) : 0,
        }))
    } catch {
        return []
    }
}

export default async function StorePage() {
    const products = await getProducts()
    const collections = getCollections()

    const featuredCollectionSlugs = [
        "veterinary-medicine",
        "animals",
        "todays-deals",
        "best-sellers",
        "anatomia-fisiologia-y-patologia",
        "diagnostico-y-medicina-interna",
        "dermatology",
        "aquatic-animals",
        "equine",
    ]
    const featuredCollections = collections.filter((c) =>
        featuredCollectionSlugs.includes(c.slug)
    )
    const displayCollections =
        featuredCollections.length > 0 ? featuredCollections : collections.slice(0, 5)

    const faqs = [
        {
            q: "Do I receive a real, physical book?",
            a: "Yes. Every order ships a printed, physical book to your US address. You also get a complimentary digital PDF copy by email so you can start reading immediately while your parcel is in transit.",
        },
        {
            q: "How much is shipping and how long does it take?",
            a: "We ship across the United States at a flat rate of $19.55 USD. Estimated delivery is 4 to 12 business days from dispatch (1–2 business days handling time).",
        },
        {
            q: "Can I return my book?",
            a: "Yes — within 30 days of delivery. Return shipping is free for all US customers. Full details in our Refund Policy.",
        },
        {
            q: "How does the digital PDF work?",
            a: "Immediately after payment, we email you a secure download link to the PDF copy of your book. The link stays valid for 30 days. The PDF reads on any phone, tablet, or computer.",
        },
    ]

    const categories = [
        { href: "/collections/anaesthesia", src: "/category_anesthesia_1768669710644.png", label: "Anesthesia" },
        { href: "/collections/animal-behavior", src: "/category_animal_behavior_1768669725321.png", label: "Animal Behavior" },
        { href: "/collections/dermatology", src: "/category_dermatology_1768669756381.png", label: "Dermatology" },
        { href: "/collections/emergency-and-critical-care", src: "/category_emergency_1768669770998.png", label: "Emergency & Critical Care" },
        { href: "/collections/veterinary-medicine", src: "/category_internal_medicine_1768669814153.png", label: "Internal Medicine" },
        { href: "/collections/veterinary-anatomy", src: "/category_physical_exam_1768669876846.png", label: "Physical Exam & Techniques" },
    ]

    return (
        <main>
            {/* Hero */}
            <HeroSection />

            {/* Trust bar */}
            <BenefitsTicker />

            <div className="max-w-[1280px] mx-auto px-5 md:px-16">

                {/* Categories */}
                <section className="py-20" id="categories">
                    <div className="mb-10">
                        <h2
                            className="text-3xl md:text-[32px] font-semibold text-[#191c1e]"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            Clinical Science
                        </h2>
                        <p className="text-[#6e7979] mt-1 text-sm">Essential diagnostic and surgical references.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {categories.map((cat) => (
                            <Link href={cat.href} key={cat.href} className="group space-y-3">
                                <div className="rounded-xl overflow-hidden aspect-square bg-[#eceef0] shadow-sm group-hover:shadow-[0_10px_30px_rgba(0,128,128,0.1)] transition-all">
                                    <Image
                                        src={cat.src}
                                        alt={cat.label}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p
                                    className="text-xs font-semibold text-[#191c1e] flex items-center gap-1 group-hover:text-[#006565] transition-colors"
                                    style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                                >
                                    {cat.label} <ArrowRight size={12} />
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="py-20 border-t border-[#bdc9c8]" id="new-arrivals">
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-px w-8 bg-[#008080]" />
                            <span
                                className="text-[#008080] font-semibold text-xs uppercase tracking-widest"
                                style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                            >
                                Freshly Added
                            </span>
                            <span className="h-px w-8 bg-[#008080]" />
                        </div>
                        <h2
                            className="text-3xl md:text-[32px] font-semibold text-[#191c1e]"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            New Arrivals
                        </h2>
                    </div>

                    <ProductGrid products={products.slice(0, 6)} />

                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/collections/todays-deals"
                            className="inline-flex items-center gap-2 border border-[#006565] text-[#006565] hover:bg-[#006565] hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm"
                            style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                        >
                            View All New Arrivals
                        </Link>
                    </div>
                </section>

            </div>

            {/* Reviews */}
            <TrustReviews />

            <div className="max-w-[1280px] mx-auto px-5 md:px-16">

                {/* Featured Collections */}
                {displayCollections.map((collection, index) => {
                    const collectionProducts = products
                        .filter((p: any) => p.collections.includes(collection.slug))
                        .slice(0, 6)
                    if (collectionProducts.length === 0) return null

                    return (
                        <section
                            key={collection.id}
                            className="py-20 border-t border-[#bdc9c8]"
                        >
                            <div className="flex flex-col items-center text-center mb-12">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="h-px w-8 bg-[#006565]" />
                                    <span
                                        className="text-[#006565] font-semibold text-xs uppercase tracking-widest"
                                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                                    >
                                        Featured Collection
                                    </span>
                                    <span className="h-px w-8 bg-[#006565]" />
                                </div>
                                <h2
                                    className="text-3xl md:text-[32px] font-semibold text-[#191c1e]"
                                    style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                                >
                                    {collection.name}
                                </h2>
                            </div>

                            <ProductGrid products={collectionProducts} />

                            <div className="mt-10 flex justify-center">
                                <Link
                                    href={`/collections/${collection.slug}`}
                                    className="inline-flex items-center gap-2 border border-[#bdc9c8] text-[#3e4949] hover:border-[#006565] hover:text-[#006565] font-semibold px-8 py-3.5 rounded-xl transition-all text-sm"
                                    style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                                >
                                    View All
                                </Link>
                            </div>
                        </section>
                    )
                })}

                {/* Why Choose Us */}
                <section className="py-20 border-t border-[#bdc9c8]">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2
                                className="text-3xl md:text-4xl font-bold text-[#191c1e] mb-5 leading-tight"
                                style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                            >
                                Trusted by Veterinary Professionals Worldwide
                            </h2>
                            <p className="text-base text-[#3e4949] mb-10 leading-relaxed">
                                Nurs Library is dedicated to bringing high-quality nursing and veterinary reference books — the real, printed ones — within reach of every student and clinician. Every order ships a physical book and includes a complimentary digital PDF so you can start reading the day you order.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: <Download className="w-5 h-5 text-[#006565]" />,
                                        bg: "bg-[#e3fffe]",
                                        title: "Physical Book Shipped",
                                        desc: "Real, printed book delivered to your US address. $19.55 flat-rate shipping · 4–12 business days.",
                                    },
                                    {
                                        icon: <Globe className="w-5 h-5 text-[#006565]" />,
                                        bg: "bg-[#d3e2ed]",
                                        title: "Bonus Digital PDF",
                                        desc: "Instant PDF copy by email so you can start reading while your shipment is on the way.",
                                    },
                                    {
                                        icon: <Award className="w-5 h-5 text-[#006565]" />,
                                        bg: "bg-[#ffd9e2]",
                                        title: "30-Day Free Returns",
                                        desc: "Not satisfied? Return your book within 30 days — return shipping is on us.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className={`flex-shrink-0 w-11 h-11 rounded-full ${item.bg} flex items-center justify-center`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3
                                                className="font-semibold text-[#191c1e] mb-1"
                                                style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                                            >
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-[#6e7979] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/nurse-hero-banner.png"
                                alt="Veterinary professional using tablet"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg max-w-xs">
                                    <div className="flex gap-0.5 text-yellow-400 mb-2">
                                        {"★★★★★"}
                                    </div>
                                    <p className="text-[#191c1e] font-medium italic text-sm mb-3 leading-relaxed">
                                        &ldquo;The book arrived in perfect condition and I had the PDF in my inbox before the parcel even left the warehouse. Brilliant service.&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#008080] text-[#e3fffe] flex items-center justify-center font-bold text-sm">
                                            SJ
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[#191c1e]">Sarah Jenkins</p>
                                            <p className="text-xs text-[#6e7979]">Veterinary Student</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Book + Bonus PDF */}
                <section className="py-20 border-t border-[#bdc9c8]">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[480px] rounded-[2rem] overflow-hidden shadow-2xl order-2 md:order-1">
                            <Image
                                src="/ebook-formats.png"
                                alt="Veterinary professional reading their printed reference book with a tablet PDF beside it"
                                fill
                                className="object-cover"
                            />
                            {/* Floating device badge */}
                            <div className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-xl hidden md:flex items-center gap-3">
                                <span className="text-2xl">📦</span>
                                <div>
                                    <p className="font-bold text-[#191c1e] text-sm">Two Formats</p>
                                    <p className="text-xs text-[#6e7979]">Print + PDF</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center order-1 md:order-2">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-px w-12 bg-[#006565]" />
                                <span
                                    className="text-[#006565] font-bold text-xs uppercase tracking-widest"
                                    style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                                >
                                    Print + Bonus PDF
                                </span>
                            </div>
                            <h2
                                className="text-4xl md:text-[48px] font-bold text-[#191c1e] mb-6 leading-tight"
                                style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif", letterSpacing: "-0.02em" }}
                            >
                                A real book, with a digital copy on the side
                            </h2>
                            <p className="text-base text-[#3e4949] mb-8 leading-relaxed">
                                Every Nurs Library order ships a printed reference book to your US address — and bundles a complimentary digital PDF copy so you can start reading the day you order. One purchase, two formats, no extra cost.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: "📦", title: "Printed Book Shipped", desc: "Delivered to your US address." },
                                    { icon: "📄", title: "Bonus PDF Copy", desc: "Emailed instantly on payment." },
                                    { icon: "🚚", title: "4–12 Day Delivery", desc: "$19.55 flat-rate US shipping." },
                                    { icon: "↩️", title: "30-Day Free Returns", desc: "Return shipping is on us." },
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-lg">{feat.icon}</span>
                                        <div>
                                            <h4 className="font-semibold text-[#191c1e] text-sm">{feat.title}</h4>
                                            <p className="text-xs text-[#6e7979]">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/collections"
                                className="self-start inline-flex items-center gap-2 bg-[#006565] hover:bg-[#008080] text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm"
                                style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                            >
                                Browse All Books
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-20 border-t border-[#bdc9c8] mb-8">
                    <h2
                        className="text-3xl md:text-[32px] font-semibold text-[#191c1e] text-center mb-12"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-2xl mx-auto space-y-3">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-[#f2f4f6] rounded-xl border border-[#bdc9c8]/50 cursor-pointer hover:border-[#006565] transition-colors"
                            >
                                <summary className="flex items-center justify-between p-6 font-semibold text-[#191c1e] select-none list-none">
                                    <span style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}>{faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className="text-[#006565] flex-shrink-0 ml-4 transition-transform group-open:rotate-180"
                                    />
                                </summary>
                                <p className="px-6 pb-6 text-sm text-[#3e4949] leading-relaxed -mt-2">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    )
}
