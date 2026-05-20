import { NextResponse } from "next/server"
import { getAllPosts } from "@/lib/blog"

export const runtime = "edge"
export const revalidate = 3600

/**
 * /llms.txt — index for AI / LLM crawlers (see https://llmstxt.org).
 * Lightweight summary of the site, with links to the most useful pages
 * for retrieval and answer-generation. Full article bodies are exposed
 * via /llms-full.txt.
 */
export async function GET() {
    const SITE_URL = "https://www.nurslibrary.com"
    const posts = getAllPosts()

    const blogList = posts
        .map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`)
        .join("\n")

    const body = `# Nurs Library

> Nurs Library (nurslibrary.com) is an online retailer of nursing and veterinary reference books for students, new graduates, and working clinicians. Every order ships a physical book to a United States address and includes complimentary instant digital PDF access so customers can begin reading while their parcel is in transit. The site also publishes evidence-based clinical articles for nurses and veterinary nurses.

Audience: practicing nurses, veterinary nurses and technicians, veterinary surgeons, medical students, and allied healthcare professionals.

Fulfillment: physical books shipped to the United States via flat-rate $19.55 USD shipping (4–12 business days transit after 1–2 business days handling). Bundled digital PDF access delivered to the customer's email immediately on payment confirmation. Payments processed securely via Stripe (cards, Apple Pay, Google Pay, and Link).

Business: Nurs Library, 7P64+R6J Abu Dhabi, Abu Dhabi 20000, United Arab Emirates. Contact: Contact@nurslibrary.com.

## Site

- [Home / shop](${SITE_URL}/): Browse the full book catalog
- [Collections](${SITE_URL}/collections): Curated category pages (surgery, pharmacology, anesthesia, etc.)
- [About](${SITE_URL}/about): Mission and editorial standards
- [Contact](${SITE_URL}/contact): Customer support
- [FAQ](${SITE_URL}/faq): Common questions about ordering, shipping, and returns

## Blog

Evidence-based clinical articles. Each post is also reachable in full text at \`/llms-full.txt\`.

${blogList}

## Policies

- [Shipping policy](${SITE_URL}/shipping-policy): US shipping, $19.55 flat, 4–12 day delivery
- [Refund policy](${SITE_URL}/refund-policy): 30-day money-back guarantee, free return shipping
- [Privacy policy](${SITE_URL}/privacy-policy)
- [Terms of service](${SITE_URL}/terms-of-service)

## Optional

- [Sitemap (XML)](${SITE_URL}/sitemap.xml)
- [Product feed (XML, Google Merchant format)](${SITE_URL}/api/product-feed)
- [Full LLM corpus](${SITE_URL}/llms-full.txt): All blog article bodies in a single Markdown document
`

    return new NextResponse(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    })
}
