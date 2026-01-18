import { NextResponse } from "next/server"
import { getRequestContext } from "@cloudflare/next-on-pages"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { path, visitorId, eventType = "page_view", metadata } = await req.json()

        // In local development, we might not have the DB binding
        // We can mock it or just skip
        const db = process.env.DB

        if (!db) {
            // If running locally without wrangler dev, just log
            console.log("[Analytics]", { path, visitorId, eventType })
            return NextResponse.json({ success: true, mocked: true })
        }

        // Insert into D1
        // Note: We use raw SQL query here as we don't have an ORM set up yet
        const stmt = db.prepare(
            "INSERT INTO Analytics (visitor_id, path, event_type, metadata) VALUES (?, ?, ?, ?)"
        ).bind(visitorId, path, eventType, JSON.stringify(metadata || {}))

        await stmt.run()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Analytics Error:", error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
