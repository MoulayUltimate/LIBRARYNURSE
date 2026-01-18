import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const db = process.env.DB as any

        if (!db) {
            return NextResponse.json({ error: "Database not available" }, { status: 500 })
        }

        const order = await db.prepare("SELECT * FROM Orders WHERE id = ?").bind(id).first()

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Failed to fetch order:", error)
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
    }
}
