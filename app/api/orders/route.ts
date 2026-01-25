import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const type = searchParams.get("type") || "completed" // 'completed' | 'abandoned'

        // Access D1 binding through Cloudflare context
        const { env } = process as any
        const db = process.env.DB || env?.DB

        if (!db) {
            console.log("DB binding not available")
            return NextResponse.json([])
        }

        if (type === "abandoned") {
            // Fetch Abandoned Checkouts
            // Logic: Carts with email that haven't converted to an order (simple approximation)
            // Ideally we'd join or check against orders, but for now let's just show recent carts with emails
            // An improvement would be to exclude emails that exist in Orders table for the same timeframe, but let's keep it simple: 
            // Show all carts with email updated in last 7 days.

            const { results } = await db.prepare(
                `SELECT 
                    id, 
                    email as customer_email, 
                    updated_at as created_at, 
                    'abandoned' as status, 
                    items, 
                    0 as amount -- Calculate from items if needed, or store it
                 FROM Carts 
                 WHERE email IS NOT NULL 
                 AND updated_at > datetime('now', '-7 days')
                 ORDER BY updated_at DESC`
            ).all()

            // Note: In a real app we'd fully parse items to get amount, here we just return list
            return NextResponse.json(results || [])
        } else {
            // Default: Fetch Completed Orders
            const { results } = await db.prepare(
                "SELECT * FROM Orders ORDER BY created_at DESC LIMIT 100"
            ).all()
            return NextResponse.json(results || [])
        }

    } catch (error) {
        console.error("Failed to fetch orders:", error)
        return NextResponse.json([], { status: 500 })
    }
}
