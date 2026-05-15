import type { MetadataRoute } from "next"
import { getCollections } from "@/lib/store"
import { getAllPosts } from "@/lib/blog"

export const runtime = "edge"
export const revalidate = 3600 // regenerate hourly

const SITE_URL = "https://www.nurslibrary.com"

async function getAllProducts(): Promise<{ id: string; updated_at?: string }[]> {
    try {
        const db = process.env.DB as any
        if (!db) return []
        const { results } = await db
            .prepare("SELECT id, updated_at FROM Products")
            .all()
        return (results || []) as { id: string; updated_at?: string }[]
    } catch (err) {
        console.error("sitemap: failed to fetch products", err)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
        { url: `${SITE_URL}/collections`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${SITE_URL}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${SITE_URL}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${SITE_URL}/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ]

    const collections = getCollections()
    const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
        url: `${SITE_URL}/collections/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    const products = await getAllProducts()
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${SITE_URL}/products/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
    }))

    const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
    }))

    return [...staticRoutes, ...collectionRoutes, ...blogRoutes, ...productRoutes]
}
