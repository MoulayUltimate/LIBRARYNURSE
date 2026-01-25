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
        } else if (type === "abandoned") {
            // Fetch Abandoned Checkouts
            // 1. Carts with email
            const { results: carts } = await db.prepare(
                `SELECT 
                    id, 
                    email as customer_email, 
                    updated_at as created_at, 
                    'abandoned_cart' as status, 
                    items, 
                    0 as amount 
                 FROM Carts 
                 WHERE email IS NOT NULL 
                 AND updated_at > datetime('now', '-7 days')
                 ORDER BY updated_at DESC`
            ).all()

            // 2. Pending Orders (older than 30m)
            const { results: pendingOrders } = await db.prepare(
                `SELECT * FROM Orders 
                 WHERE status = 'pending' 
                 AND created_at > datetime('now', '-7 days')
                 AND created_at < datetime('now', '-30 minutes')
                 ORDER BY created_at DESC`
            ).all()

            // Combine
            const results = [...(pendingOrders || []), ...(carts || [])].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )

            return NextResponse.json(results)
        } else {
            // Default: Fetch All Orders (excluding the strictly abandoned ones from the main view if desired, 
            // but usually main view shows everything. User said "they show as pending". 
            // We can keep showing them here, or filter them out?)
            // Let's keep showing all actual ORDERS here.
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
