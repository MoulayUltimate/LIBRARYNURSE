import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
    try {
        const db = process.env.DB as any

        if (!db) {
            return NextResponse.json([])
        }

        const { results } = await db.prepare(
            "SELECT * FROM Messages ORDER BY created_at DESC"
        ).all()

        return NextResponse.json(results)
    } catch (error) {
        console.error("Failed to fetch messages:", error)
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}
