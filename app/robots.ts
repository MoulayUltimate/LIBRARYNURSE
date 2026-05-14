import type { MetadataRoute } from "next"

const SITE_URL = "https://www.nurslibrary.com"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin",
                    "/admin/",
                    "/api/",
                    "/cart",
                    "/checkout",
                    "/order-confirmation",
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
