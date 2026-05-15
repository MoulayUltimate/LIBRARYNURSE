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

    const body = `# NursLibrary

> NursLibrary is a digital store and editorial resource for veterinary and medical professionals. We sell instant-download eBooks covering surgery, pharmacology, anesthesia, dermatology, internal medicine, emergency medicine, radiology, dentistry, ophthalmology, animal behavior, epidemiology, and physical exam, and we publish evidence-based clinical articles for nurses and veterinary nurses.

Audience: practicing nurses, veterinary nurses and technicians, veterinary surgeons, medical students, and allied healthcare professionals.

Format: all eBooks are delivered as PDF for instant download after purchase. Payments are processed via Stripe and PayPal.

## Site

- [Home / shop](${SITE_URL}/): Browse the full eBook catalog
- [Collections](${SITE_URL}/collections): Curated category pages (surgery, pharmacology, anesthesia, etc.)
- [About](${SITE_URL}/about): Mission and editorial standards
- [Contact](${SITE_URL}/contact): Customer support and editorial inquiries

## Blog

Evidence-based clinical articles. Each post is also reachable in full text at \`/llms-full.txt\`.

${blogList}

## Policies

- [Shipping policy](${SITE_URL}/shipping-policy): Digital delivery terms
- [Refund policy](${SITE_URL}/refund-policy)
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
