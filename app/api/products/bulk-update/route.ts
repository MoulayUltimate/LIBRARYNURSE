import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { percentage } = await req.json()
        const db = process.env.DB

        if (!db) return NextResponse.json({ error: "No Database" }, { status: 500 })

        if (typeof percentage !== "number") {
            return NextResponse.json({ error: "Invalid percentage" }, { status: 400 })
        }

        // Calculate multiplier (e.g., 10% -> 1.10, -20% -> 0.80)
        const multiplier = 1 + (percentage / 100)

        // Update all products
        // SQLite doesn't have a simple "UPDATE ... SET price = price * ?" in one go with D1's bind easily for all rows if we want to be safe, 
        // but standard SQL works.

        const result = await db.prepare(
            `UPDATE Products SET price = ROUND(price * ?, 2)`
        ).bind(multiplier).run()

        return NextResponse.json({
            success: true,
            message: `Updated prices by ${percentage}%`,
            changes: result.meta.changes
        })
    } catch (error) {
        console.error("Bulk update error:", error)
        return NextResponse.json({ error: "Failed to update prices" }, { status: 500 })
    }
}
