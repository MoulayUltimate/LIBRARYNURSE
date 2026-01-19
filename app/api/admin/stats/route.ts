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
                activeCarts: 0,
                recentActivity: [],
                countryStats: [],
                trafficSources: [],
                liveBehavior: {
                    inCart: 0,
                    inCheckout: 0,
                    recentPurchases: []
                }
            })
        }

        // Filter out admin visits: path NOT LIKE '/admin%'
        const adminFilter = "path NOT LIKE '/admin%'"

        // 1. Total Visitors (unique visitor_ids, excluding admin)
        const totalVisitorsResult = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics WHERE ${adminFilter}`
        ).first()

        // 2. Page Views (total rows in Analytics, excluding admin)
        const pageViewsResult = await db.prepare(
            `SELECT COUNT(*) as count FROM Analytics WHERE event_type = 'page_view' AND ${adminFilter}`
        ).first()

        // 3. Live Visitors (visitors active in last 5 minutes, excluding admin)
        const liveVisitorsResult = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics 
             WHERE created_at > datetime('now', '-5 minutes') AND ${adminFilter}`
        ).first()

        // 4. Recent Activity (excluding admin)
        const { results: recentActivity } = await db.prepare(
            `SELECT * FROM Analytics WHERE ${adminFilter} ORDER BY created_at DESC LIMIT 10`
        ).all()

        // 5. Active Carts (carts updated in last 24 hours)
        const activeCartsResult = await db.prepare(
            "SELECT COUNT(*) as count FROM Carts WHERE updated_at > datetime('now', '-1 day')"
        ).first()

        // 6. Country Stats (top countries by visitor count, excluding admin)
        const { results: countryStats } = await db.prepare(
            `SELECT country, COUNT(DISTINCT visitor_id) as visitors 
             FROM Analytics 
             WHERE country IS NOT NULL AND country != 'XX' AND ${adminFilter}
             GROUP BY country 
             ORDER BY visitors DESC 
             LIMIT 10`
        ).all()

        // 7. Traffic Sources (excluding admin)
        const { results: trafficSources } = await db.prepare(
            `SELECT referrer_source, COUNT(DISTINCT visitor_id) as visitors 
             FROM Analytics 
             WHERE referrer_source IS NOT NULL AND ${adminFilter}
             GROUP BY referrer_source 
             ORDER BY visitors DESC`
        ).all()

        // 8. Live User Behavior
        // Users with items in cart (add_to_cart events in last 30 minutes)
        const inCartResult = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics 
             WHERE event_type = 'add_to_cart' 
             AND created_at > datetime('now', '-30 minutes')
             AND ${adminFilter}`
        ).first()

        // Users in checkout (checkout_start events in last 15 minutes)
        const inCheckoutResult = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics 
             WHERE event_type = 'checkout_start' 
             AND created_at > datetime('now', '-15 minutes')
             AND ${adminFilter}`
        ).first()

        // Recent purchases (last 24 hours)
        const { results: recentPurchases } = await db.prepare(
            `SELECT visitor_id, metadata, created_at FROM Analytics 
             WHERE event_type = 'purchase' 
             AND created_at > datetime('now', '-24 hours')
             AND ${adminFilter}
             ORDER BY created_at DESC 
             LIMIT 10`
        ).all()

        return NextResponse.json({
            totalVisitors: totalVisitorsResult?.count || 0,
            liveVisitors: liveVisitorsResult?.count || 0,
            pageViews: pageViewsResult?.count || 0,
            activeCarts: activeCartsResult?.count || 0,
            recentActivity: recentActivity.map((a: any) => ({
                id: a.id,
                user: `Visitor #${a.visitor_id.substring(0, 6)}`,
                action: formatEventAction(a.event_type, a.path, a.metadata),
                time: new Date(a.created_at).toLocaleTimeString(),
                country: a.country
            })),
            countryStats: countryStats.map((c: any) => ({
                country: c.country,
                visitors: c.visitors
            })),
            trafficSources: trafficSources.map((t: any) => ({
                source: t.referrer_source,
                visitors: t.visitors
            })),
            liveBehavior: {
                inCart: inCartResult?.count || 0,
                inCheckout: inCheckoutResult?.count || 0,
                recentPurchases: recentPurchases.map((p: any) => ({
                    visitorId: p.visitor_id.substring(0, 6),
                    time: new Date(p.created_at).toLocaleTimeString(),
                    metadata: typeof p.metadata === 'string' ? JSON.parse(p.metadata) : p.metadata
                }))
            }
        })

    } catch (error) {
        console.error("Failed to fetch stats:", error)
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}

function formatEventAction(eventType: string, path: string, metadata: any): string {
    switch (eventType) {
        case 'page_view':
            return `Viewed ${path}`
        case 'add_to_cart':
            return `Added item to cart`
        case 'checkout_start':
            return `Started checkout`
        case 'purchase':
            return `Completed purchase`
        default:
            return eventType
    }
}
