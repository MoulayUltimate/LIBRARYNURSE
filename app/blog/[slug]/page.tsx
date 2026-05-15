import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug, renderMarkdown } from "@/lib/blog"

export const runtime = "edge"
export const revalidate = 3600

const SITE_URL = "https://www.nurslibrary.com"

export async function generateStaticParams() {
    return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) return { title: "Article not found" }

    const url = `${SITE_URL}/blog/${post.slug}`
    const image = `${SITE_URL}${post.heroImage}`

    return {
        title: post.title,
        description: post.description,
        keywords: post.keywords,
        authors: [{ name: post.author }],
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            type: "article",
            url,
            title: post.title,
            description: post.description,
            siteName: "NursLibrary",
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt || post.publishedAt,
            authors: [post.author],
            tags: post.tags,
            images: [{ url: image, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: [image],
        },
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) notFound()

    const html = renderMarkdown(post.body)
    const url = `${SITE_URL}/blog/${post.slug}`

    const related = getAllPosts()
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3)

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: `${SITE_URL}${post.heroImage}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: { "@type": "Organization", name: post.author, url: SITE_URL },
        publisher: {
            "@type": "Organization",
            name: "NursLibrary",
            url: SITE_URL,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/nurslibrary-logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: post.keywords.join(", "),
        articleSection: post.category,
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
    }

    const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <main className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />

            <article className="max-w-3xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-20">
                {/* Breadcrumb */}
                <nav className="text-xs text-[#6e7979] mb-6" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-[#006565]">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/blog" className="hover:text-[#006565]">Blog</Link>
                    <span className="mx-2">/</span>
                    <span className="text-[#3e4949]">{post.category}</span>
                </nav>

                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#006565] bg-[#e3fffe] border border-[#76d6d5]/50 px-3 py-1 rounded-full">
                            {post.category}
                        </span>
                        <span className="text-xs font-medium text-[#6e7979]">
                            {post.readTimeMinutes} min read
                        </span>
                    </div>
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#191c1e] leading-tight mb-4"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        {post.title}
                    </h1>
                    <p
                        className="text-lg text-[#3e4949] leading-relaxed mb-6"
                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                    >
                        {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#6e7979] border-y border-[#bdc9c8] py-4">
                        <span className="font-medium text-[#191c1e]">{post.author}</span>
                        <span>·</span>
                        <time dateTime={post.publishedAt}>{formattedDate}</time>
                    </div>
                </header>

                {/* Hero image */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#f2f4f6] mb-10">
                    <Image
                        src={post.heroImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 768px, 100vw"
                        priority
                    />
                </div>

                {/* Body */}
                <div
                    className="blog-prose"
                    dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-[#bdc9c8]">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-medium text-[#3e4949] bg-[#f2f4f6] px-3 py-1.5 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <aside className="mt-12 p-8 md:p-10 bg-gradient-to-br from-[#e3fffe] to-white border border-[#76d6d5]/40 rounded-2xl">
                    <h3
                        className="text-xl md:text-2xl font-bold text-[#191c1e] mb-2"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        Build the library this article was written from.
                    </h3>
                    <p
                        className="text-[#3e4949] mb-5"
                        style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                    >
                        500+ premium veterinary & medical eBooks, instant PDF download, read on any device.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#006565] hover:bg-[#008080] text-white font-semibold px-6 py-3 rounded-full transition-colors"
                    >
                        Browse the library →
                    </Link>
                </aside>
            </article>

            {/* Related */}
            {related.length > 0 && (
                <section className="bg-[#f9fafb] border-t border-[#bdc9c8] py-16">
                    <div className="max-w-[1280px] mx-auto px-5 md:px-16">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-[#191c1e] mb-8"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                        >
                            More from the journal
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {related.map((p) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-white mb-4">
                                        <Image
                                            src={p.heroImage}
                                            alt={p.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(min-width: 768px) 33vw, 100vw"
                                        />
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#006565] mb-2">
                                        {p.category}
                                    </p>
                                    <h3
                                        className="text-lg font-bold text-[#191c1e] leading-snug group-hover:text-[#006565] transition-colors"
                                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                                    >
                                        {p.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}
