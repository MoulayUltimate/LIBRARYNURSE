import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { path, visitorId, eventType = "page_view", referrerSource, referrerUrl, metadata, deviceType } = await req.json()

        // Extract country from Cloudflare headers
        // @ts-ignore - Cloudflare specific property
        const country = req.cf?.country || "XX" // XX for unknown

        // In local development, we might not have the DB binding
        const db = process.env.DB as any

        if (!db) {
            // If running locally without wrangler dev, just log
            console.log("[Analytics]", { path, visitorId, eventType, country, referrerSource, deviceType })
            return NextResponse.json({ success: true, mocked: true })
        }

        // Insert into D1 with new fields
        // Note: device_type column was added in update_analytics_schema.sql
        const stmt = db.prepare(
            `INSERT INTO Analytics 
            (visitor_id, path, event_type, country, referrer_source, referrer_url, metadata, device_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            visitorId,
            path,
            eventType,
            country,
            referrerSource || "direct",
            referrerUrl || null,
            JSON.stringify(metadata || {}),
            deviceType || "unknown"
        )

        await stmt.run()

        return NextResponse.json({ success: true, country })
    } catch (error) {
        console.error("Analytics Error:", error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
