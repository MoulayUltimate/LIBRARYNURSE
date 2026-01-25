import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const period = searchParams.get("period") || "all" // 'today', '7d', 'all'
        const db = process.env.DB as any

        if (!db) {
            return NextResponse.json({
                totalVisitors: 0,
                liveVisitors: 0,
                pageViews: 0,
                activeCarts: 0,
                successfulOrders: 0,
                canceledOrders: 0,
                abandonedCheckouts: 0,
                recentActivity: [],
                countryStats: [],
                trafficSources: [],
                topPages: [],
                deviceBreakdown: [],
                liveBehavior: { inCart: 0, inCheckout: 0, recentPurchases: [] }
            })
        }

        // Date Filter Parsing
        let dateFilter = "1=1"
        if (period === "today") {
            dateFilter = "created_at >= date('now', 'start of day')"
        } else if (period === "7d") {
            dateFilter = "created_at >= date('now', '-7 days')"
        }

        // Filter out admin
        const adminFilter = `path NOT LIKE '/admin%' AND ${dateFilter}`

        // 1. Basic Counts
        const totalVisitorsConfig = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics WHERE ${adminFilter}`
        ).first()

        const pageViewsConfig = await db.prepare(
            `SELECT COUNT(*) as count FROM Analytics WHERE event_type = 'page_view' AND ${adminFilter}`
        ).first()

        // 2. Live Visitors (Always last 5 mins, ignore filter)
        const liveVisitorsConfig = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics 
             WHERE created_at > datetime('now', '-5 minutes') AND path NOT LIKE '/admin%'`
        ).first()

        // 3. Orders Stats
        // Successful: status = 'succeeded'
        // Canceled/Failed: status IN ('failed', 'canceled')
        // Note: Orders table might not have visitor_id easy link, but we count purely by date
        const ordersDateFilter = period === "today"
            ? "created_at >= date('now', 'start of day')"
            : period === "7d" ? "created_at >= date('now', '-7 days')"
                : "1=1"

        const successfulOrders = await db.prepare(
            `SELECT COUNT(*) as count FROM Orders WHERE status = 'succeeded' AND ${ordersDateFilter}`
        ).first()

        const canceledOrders = await db.prepare(
            `SELECT COUNT(*) as count FROM Orders WHERE status IN ('failed', 'canceled') AND ${ordersDateFilter}`
        ).first()

        // 4. Abandoned Checkouts
        // Logic: active carts (updated recently) that don't match a successful order email
        // This is an estimation. For "today", we look at carts updated today.
        const cartsDateFilter = period === "today"
            ? "updated_at >= date('now', 'start of day')"
            : period === "7d" ? "updated_at >= date('now', '-7 days')"
                : "updated_at >= date('now', '-1 day')" // default definition

        const abandonedCarts = await db.prepare(
            `SELECT COUNT(*) as count FROM Carts 
             WHERE email IS NOT NULL 
             AND ${cartsDateFilter}
             AND email NOT IN (SELECT customer_email FROM Orders WHERE status = 'succeeded')`
        ).first()

        // Also count "pending" orders as abandoned if they are older than 30 mins
        // (User considers pending orders as abandoned checkouts)
        const pendingOrdersAsAbandoned = await db.prepare(
            `SELECT COUNT(*) as count FROM Orders 
             WHERE status = 'pending' 
             AND ${ordersDateFilter}
             AND created_at < datetime('now', '-30 minutes')`
        ).first()

        const abandonedCheckouts = {
            count: (abandonedCarts?.count || 0) + (pendingOrdersAsAbandoned?.count || 0)
        }

        // 5. Active Carts (Live metric)
        const activeCartsConfig = await db.prepare(
            "SELECT COUNT(*) as count FROM Carts WHERE updated_at > datetime('now', '-24 hours')"
        ).first()

        // 6. Top Pages
        const { results: topPages } = await db.prepare(
            `SELECT path, COUNT(*) as views 
             FROM Analytics 
             WHERE event_type = 'page_view' AND ${adminFilter}
             GROUP BY path 
             ORDER BY views DESC 
             LIMIT 10`
        ).all()

        // 7. Device Breakdown
        // Only if device_type exists (we added it), otherwise nulls
        // We use user_agent parsing if we stored it, or the new device_type column
        // Assuming we rely on the new column 'device_type'
        const { results: deviceStats } = await db.prepare(
            `SELECT device_type, COUNT(DISTINCT visitor_id) as visitors 
             FROM Analytics 
             WHERE device_type IS NOT NULL AND ${adminFilter}
             GROUP BY device_type 
             ORDER BY visitors DESC`
        ).all()

        // 8. Country Stats
        const { results: countryStats } = await db.prepare(
            `SELECT country, COUNT(DISTINCT visitor_id) as visitors 
             FROM Analytics 
             WHERE country IS NOT NULL AND country != 'XX' AND ${adminFilter}
             GROUP BY country 
             ORDER BY visitors DESC 
             LIMIT 10`
        ).all()

        // 9. Traffic Sources
        const { results: trafficSources } = await db.prepare(
            `SELECT referrer_source, COUNT(DISTINCT visitor_id) as visitors 
             FROM Analytics 
             WHERE referrer_source IS NOT NULL AND ${adminFilter}
             GROUP BY referrer_source 
             ORDER BY visitors DESC`
        ).all()

        // 10. Live User Behavior (Last 30m, independent of filter usually, but let's keep it live)
        const inCartResult = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics 
            WHERE event_type = 'add_to_cart' 
            AND created_at > datetime('now', '-30 minutes')
            AND path NOT LIKE '/admin%'`
        ).first()

        const inCheckoutResult = await db.prepare(
            `SELECT COUNT(DISTINCT visitor_id) as count FROM Analytics 
            WHERE event_type = 'checkout_start' 
            AND created_at > datetime('now', '-15 minutes')
            AND path NOT LIKE '/admin%'`
        ).first()

        const { results: recentPurchases } = await db.prepare(
            `SELECT visitor_id, metadata, created_at FROM Analytics 
            WHERE event_type = 'purchase' 
            AND created_at > datetime('now', '-24 hours')
            AND path NOT LIKE '/admin%'
            ORDER BY created_at DESC 
            LIMIT 10`
        ).all()

        // 11. Recent Activity Log (Filtered by date)
        const { results: recentActivity } = await db.prepare(
            `SELECT * FROM Analytics WHERE ${adminFilter} ORDER BY created_at DESC LIMIT 20`
        ).all()


        return NextResponse.json({
            totalVisitors: totalVisitorsConfig?.count || 0,
            pageViews: pageViewsConfig?.count || 0,
            liveVisitors: liveVisitorsConfig?.count || 0,
            activeCarts: activeCartsConfig?.count || 0,
            successfulOrders: successfulOrders?.count || 0,
            canceledOrders: canceledOrders?.count || 0,
            abandonedCheckouts: abandonedCheckouts?.count || 0,

            topPages: topPages.map((p: any) => ({ path: p.path, views: p.views })),
            deviceBreakdown: deviceStats.map((d: any) => ({ device: d.device_type, visitors: d.visitors })),
            countryStats: countryStats.map((c: any) => ({ country: c.country, visitors: c.visitors })),
            trafficSources: trafficSources.map((t: any) => ({ source: t.referrer_source, visitors: t.visitors })),

            recentActivity: recentActivity.map((a: any) => ({
                id: a.id,
                user: `Visitor #${a.visitor_id.substring(0, 6)}`,
                action: formatEventAction(a.event_type, a.path),
                time: new Date(a.created_at).toLocaleTimeString(), // Simple time for list
                country: a.country
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

function formatEventAction(eventType: string, path: string): string {
    switch (eventType) {
        case 'page_view': return `Viewed ${path}`
        case 'add_to_cart': return `Added to cart`
        case 'checkout_start': return `Started checkout`
        case 'purchase': return `Purchased`
        default: return eventType
    }
}
