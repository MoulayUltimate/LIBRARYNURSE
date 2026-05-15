import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts } from "@/lib/blog"

export const runtime = "edge"
export const revalidate = 3600

const SITE_URL = "https://www.nurslibrary.com"

export const metadata: Metadata = {
    title: "Nursing & Veterinary Blog — Clinical Insights for Healthcare Professionals",
    description:
        "Evidence-based articles on nursing practice, patient safety, pharmacology, wound care, and veterinary nursing. Practical clinical insights for healthcare professionals.",
    keywords: [
        "nursing blog",
        "veterinary nursing blog",
        "evidence based nursing",
        "patient safety nursing",
        "nursing education",
        "clinical nursing articles",
        "nurse burnout",
        "medication safety",
        "wound care",
    ],
    alternates: { canonical: "/blog" },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/blog`,
        title: "Nursing & Veterinary Blog — NursLibrary",
        description:
            "Evidence-based articles on nursing practice, patient safety, pharmacology, wound care, and veterinary nursing.",
        siteName: "NursLibrary",
    },
    twitter: {
        card: "summary_large_image",
        title: "Nursing & Veterinary Blog — NursLibrary",
        description:
            "Evidence-based articles for nursing and veterinary healthcare professionals.",
    },
}

export default function BlogIndexPage() {
    const posts = getAllPosts()

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "NursLibrary Blog",
        description:
            "Evidence-based articles on nursing practice, patient safety, pharmacology, and veterinary nursing.",
        url: `${SITE_URL}/blog`,
        publisher: {
            "@type": "Organization",
            name: "NursLibrary",
            url: SITE_URL,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/nurslibrary-logo.png` },
        },
        blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.publishedAt,
            dateModified: p.updatedAt || p.publishedAt,
            url: `${SITE_URL}/blog/${p.slug}`,
            author: { "@type": "Organization", name: p.author },
            image: `${SITE_URL}${p.heroImage}`,
        })),
    }

    const [featured, ...rest] = posts

    return (
        <main className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#e3fffe] via-white to-[#f2f4f6] border-b border-[#bdc9c8]">
                <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-24">
                    <p
                        className="text-sm font-semibold uppercase tracking-[0.18em] text-[#006565] mb-3"
                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                    >
                        NursLibrary Journal
                    </p>
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#191c1e] leading-tight mb-4 max-w-3xl"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        Clinical insights for nursing & veterinary professionals.
                    </h1>
                    <p
                        className="text-lg md:text-xl text-[#3e4949] max-w-2xl"
                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                    >
                        Evidence-based articles on patient safety, pharmacology, wound care,
                        burnout, and the practical side of bedside practice.
                    </p>
                </div>
            </section>

            {/* Featured */}
            {featured && (
                <section className="max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16">
                    <Link
                        href={`/blog/${featured.slug}`}
                        className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-2xl overflow-hidden bg-[#f2f4f6]">
                            <Image
                                src={featured.heroImage}
                                alt={featured.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(min-width: 768px) 50vw, 100vw"
                                priority
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#006565] bg-[#e3fffe] border border-[#76d6d5]/50 px-3 py-1 rounded-full">
                                    Featured
                                </span>
                                <span className="text-xs font-medium text-[#6e7979]">
                                    {featured.category} · {featured.readTimeMinutes} min read
                                </span>
                            </div>
                            <h2
                                className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#191c1e] leading-tight mb-4 group-hover:text-[#006565] transition-colors"
                                style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                            >
                                {featured.title}
                            </h2>
                            <p
                                className="text-base md:text-lg text-[#3e4949] leading-relaxed mb-6"
                                style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                            >
                                {featured.excerpt}
                            </p>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#006565] group-hover:gap-3 transition-all">
                                Read article →
                            </span>
                        </div>
                    </Link>
                </section>
            )}

            {/* Grid */}
            <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-20">
                <div className="border-t border-[#bdc9c8] pt-12">
                    <h2
                        className="text-2xl md:text-3xl font-bold text-[#191c1e] mb-8"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        All articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rest.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group block"
                            >
                                <article>
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#f2f4f6] mb-4">
                                        <Image
                                            src={post.heroImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-[#6e7979] mb-2">
                                        <span className="text-[#006565] font-semibold uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                        <span>·</span>
                                        <span>{post.readTimeMinutes} min</span>
                                    </div>
                                    <h3
                                        className="text-lg md:text-xl font-bold text-[#191c1e] leading-snug mb-2 group-hover:text-[#006565] transition-colors"
                                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                                    >
                                        {post.title}
                                    </h3>
                                    <p
                                        className="text-sm text-[#3e4949] leading-relaxed line-clamp-3"
                                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                                    >
                                        {post.excerpt}
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
