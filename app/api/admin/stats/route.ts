import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
    try {
        const db = process.env.DB as any

        if (!db) {
            // Return mock data if no DB
            return NextResponse.json({
                totalVisitors: 0,
                liveVisitors: 0,
                pageViews: 0,
                recentActivity: []
            })
        }

        // 1. Total Visitors (unique visitor_ids)
        const totalVisitorsResult = await db.prepare(
            "SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics"
        ).first()

        // 2. Page Views (total rows in Analytics)
        const pageViewsResult = await db.prepare(
            "SELECT COUNT(*) as count FROM Analytics WHERE event_type = 'page_view'"
        ).first()

        // 3. Live Visitors (visitors active in last 5 minutes)
        // SQLite doesn't have NOW(), use datetime('now')
        const liveVisitorsResult = await db.prepare(
            "SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics WHERE created_at > datetime('now', '-5 minutes')"
        ).first()

        // 4. Recent Activity
        const { results: recentActivity } = await db.prepare(
            "SELECT * FROM Analytics ORDER BY created_at DESC LIMIT 5"
        ).all()

        // 5. Active Carts (carts updated in last 24 hours)
        const activeCartsResult = await db.prepare(
            "SELECT COUNT(*) as count FROM Carts WHERE updated_at > datetime('now', '-1 day')"
        ).first()

        return NextResponse.json({
            totalVisitors: totalVisitorsResult?.count || 0,
            liveVisitors: liveVisitorsResult?.count || 0,
            pageViews: pageViewsResult?.count || 0,
            activeCarts: activeCartsResult?.count || 0,
            recentActivity: recentActivity.map((a: any) => ({
                id: a.id,
                user: `Visitor #${a.visitor_id.substring(0, 4)}`,
                action: a.event_type === 'page_view' ? `Viewed ${a.path}` : a.event_type,
                time: new Date(a.created_at).toLocaleTimeString()
            }))
        })

    } catch (error) {
        console.error("Failed to fetch stats:", error)
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}
