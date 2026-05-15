import { NextResponse } from "next/server"
import { getAllPosts } from "@/lib/blog"

export const runtime = "edge"
export const revalidate = 3600

/**
 * /llms-full.txt — full corpus for LLM ingestion.
 * Every blog post concatenated into a single Markdown document so
 * AI crawlers can fetch all editorial content in one request.
 */
export async function GET() {
    const SITE_URL = "https://www.nurslibrary.com"
    const posts = getAllPosts()

    const sections = posts
        .map((p) => {
            const url = `${SITE_URL}/blog/${p.slug}`
            return `# ${p.title}

Source: ${url}
Author: ${p.author}
Published: ${p.publishedAt}
Category: ${p.category}
Tags: ${p.tags.join(", ")}

${p.body.trim()}
`
        })
        .join("\n\n---\n\n")

    const header = `# NursLibrary — Full editorial corpus

This document contains the full text of every article on ${SITE_URL}/blog,
provided in a single Markdown file for AI/LLM ingestion.

Site: ${SITE_URL}
License: All content © NursLibrary. Quotation with attribution is permitted.
Last generated: ${new Date().toISOString().slice(0, 10)}

---

`

    return new NextResponse(header + sections + "\n", {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    })
}
