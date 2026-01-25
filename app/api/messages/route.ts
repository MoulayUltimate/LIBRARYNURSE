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

        return NextResponse.json(results || [])
    } catch (error) {
        console.error("Failed to fetch messages:", error)
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { id, action } = body
        const db = process.env.DB as any

        if (!db) return NextResponse.json({ error: "No DB" }, { status: 500 })

        if (action === 'mark_read' && id) {
            await db.prepare(
                "UPDATE Messages SET read = 1 WHERE id = ?"
            ).bind(id).run()
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}
