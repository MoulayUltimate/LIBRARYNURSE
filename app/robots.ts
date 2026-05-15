import type { MetadataRoute } from "next"

const SITE_URL = "https://www.nurslibrary.com"

export default function robots(): MetadataRoute.Robots {
    const sharedDisallow = [
        "/admin",
        "/admin/",
        "/api/",
        "/cart",
        "/checkout",
        "/order-confirmation",
    ]

    // Explicitly welcome major AI crawlers to the blog & llms.txt corpus.
    const aiAgents = [
        "GPTBot",
        "OAI-SearchBot",
        "ChatGPT-User",
        "ClaudeBot",
        "Claude-Web",
        "anthropic-ai",
        "PerplexityBot",
        "Google-Extended",
        "Applebot-Extended",
        "CCBot",
        "Bytespider",
        "Amazonbot",
        "Meta-ExternalAgent",
    ]

    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: sharedDisallow },
            ...aiAgents.map((ua) => ({
                userAgent: ua,
                allow: ["/", "/blog/", "/llms.txt", "/llms-full.txt"],
                disallow: sharedDisallow,
            })),
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
