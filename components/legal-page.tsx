import type React from "react"
import Link from "next/link"

interface LegalPageProps {
    title: string
    subtitle?: string
    lastUpdated: string
    children: React.ReactNode
}

/**
 * Shared layout for legal / policy / informational pages.
 * Consistent typography and width so Google Merchant reviewers see
 * a coherent, professional set of policy documents.
 */
export function LegalPage({ title, subtitle, lastUpdated, children }: LegalPageProps) {
    return (
        <main className="bg-white min-h-screen">
            <section className="bg-gradient-to-br from-[#e3fffe] via-white to-[#f2f4f6] border-b border-[#bdc9c8]">
                <div className="max-w-3xl mx-auto px-5 md:px-8 py-14 md:py-20">
                    <nav className="text-xs text-[#6e7979] mb-4" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-[#006565]">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-[#3e4949]">{title}</span>
                    </nav>
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#191c1e] leading-tight"
                        style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                    >
                        {title}
                    </h1>
                    {subtitle && (
                        <p
                            className="mt-4 text-base md:text-lg text-[#3e4949]"
                            style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                        >
                            {subtitle}
                        </p>
                    )}
                    <p className="mt-6 text-xs text-[#6e7979]">Last updated: {lastUpdated}</p>
                </div>
            </section>

            <article className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 legal-prose">
                {children}
            </article>
        </main>
    )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2
                className="text-xl md:text-2xl font-bold text-[#191c1e] mb-3"
                style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
            >
                {title}
            </h2>
            <div className="text-[#3e4949] leading-relaxed space-y-3">{children}</div>
        </section>
    )
}
