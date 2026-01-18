import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
    try {
        // Access D1 binding through Cloudflare context
        const { env } = process as any
        const db = env?.DB

        if (!db) {
            console.log("DB binding not available")
            return NextResponse.json([])
        }

        const { results } = await db.prepare(
            "SELECT * FROM Orders ORDER BY created_at DESC"
        ).all()

        return NextResponse.json(results || [])
    } catch (error) {
        console.error("Failed to fetch orders:", error)
        return NextResponse.json([], { status: 200 })
    }
}
