import { NextResponse } from "next/server"
import { products } from "@/lib/store"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const db = process.env.DB as any
        if (!db) return NextResponse.json({ error: "No Database" }, { status: 500 })

        // Check if products already exist to avoid duplicates
        const existing = await db.prepare("SELECT COUNT(*) as count FROM Products").first()
        if (existing && existing.count > 0) {
            return NextResponse.json({ message: "Database already seeded", count: existing.count })
        }

        // Insert products in batches
        const stmt = db.prepare(
            `INSERT INTO Products (id, title, price, description, image, download_link, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
        )

        const batch = []
        for (const p of products) {
            const product = p as any
            // Use a placeholder for download link if not present
            const downloadLink = product.download_link || ""
            // Use the first image if it's an array (though store.ts seems to use string)
            const image = Array.isArray(product.image) ? product.image[0] : product.image

            batch.push(stmt.bind(
                product.id,
                product.title,
                product.price,
                product.description,
                image,
                downloadLink,
                product.category
            ))
        }

        // Execute batch
        // D1 batch limit is usually around 100 statements, so we might need to chunk if products > 100
        // store.ts has ~8000 lines but let's see how many products.
        // If it's huge, we should chunk it.

        const chunkSize = 50
        for (let i = 0; i < batch.length; i += chunkSize) {
            await db.batch(batch.slice(i, i + chunkSize))
        }

        return NextResponse.json({ success: true, count: products.length })
    } catch (error) {
        console.error("Seeding error:", error)
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
    }
}
