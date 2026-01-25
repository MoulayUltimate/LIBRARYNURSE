import { NextResponse } from "next/server"
import { getGA4Report, getRealtimeReport } from "@/lib/ga4"

export const runtime = "edge"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const period = searchParams.get("period") || "7d" // 'today', '7d', '28d'

        let dateRanges = [{ startDate: '7daysAgo', endDate: 'today' }]
        if (period === 'today') dateRanges = [{ startDate: 'today', endDate: 'today' }]
        if (period === '28d') dateRanges = [{ startDate: '28daysAgo', endDate: 'today' }]

        // 1. Basic Totals (Users, Views, Sessions)
        // No dimensions to get aggregates
        const totalsReport = await getGA4Report(
            dateRanges,
            [],
            [{ name: "activeUsers" }, { name: "screenPageViews" }, { name: "sessions" }]
        )

        // 2. Top Countries
        const countriesReport = await getGA4Report(
            dateRanges,
            [{ name: "country" }, { name: "countryId" }], // countryId might help with codes if needed, or just country
            [{ name: "activeUsers" }],
            5
        )

        // 3. Top Sources
        const sourcesReport = await getGA4Report(
            dateRanges,
            [{ name: "sessionSource" }],
            [{ name: "activeUsers" }],
            5
        )

        // 4. Top Pages
        const pagesReport = await getGA4Report(
            dateRanges,
            [{ name: "pagePath" }],
            [{ name: "screenPageViews" }],
            7
        )

        // 5. Realtime Users (Last 30 min usually, but 'activeUsers' in realtime report is active now)
        const realtimeReport = await getRealtimeReport(
            [], // No dimensions = total active users
            [{ name: "activeUsers" }]
        )

        // If no data (e.g. no keys), return distinct "not configured" response
        if (!totalsReport) {
            return NextResponse.json({
                configured: false,
                totalVisitors: 0,
                pageViews: 0,
                liveVisitors: 0,
                countryStats: [],
                trafficSources: [],
                topPages: []
            })
        }

        // Parse Totals
        const totalRow = totalsReport.rows?.[0]
        const totalVisitors = parseInt(totalRow?.metricValues?.[0]?.value || "0")
        const pageViews = parseInt(totalRow?.metricValues?.[1]?.value || "0")

        // Parse Realtime
        // Realtime report rows might be empty if 0 users
        const liveVisitors = parseInt(realtimeReport?.rows?.[0]?.metricValues?.[0]?.value || "0")

        // Parse Countries
        // GA return: Country Name in dim 0
        // We need code? GA returns name like "United States". 
        // We might need to map manual names or request 'countryId' (ISO)? 
        // GA dim 'country' is Name. 'countryId' is usually ISO. Let's try to map or use name.
        // Actually, let's keep it simple. If we want flags, we need codes.
        // Let's rely on the dashboard's name mapping or just use names for now.
        // Parse Countries
        // Dimensions requested: [{ name: "country" }, { name: "countryId" }]
        // row.dimensionValues[0] = Country Name (e.g. "United States")
        // row.dimensionValues[1] = Country ISO Code (e.g. "US")
        const countryStats = (countriesReport?.rows || []).map((row: any) => ({
            country: row.dimensionValues[1]?.value || "XX", // ISO Code for flag
            name: row.dimensionValues[0]?.value || "Unknown", // Full Name for label
            visitors: parseInt(row.metricValues[0].value)
        }))

        // Parse Sources
        const trafficSources = (sourcesReport?.rows || []).map((row: any) => ({
            source: row.dimensionValues[0].value,
            visitors: parseInt(row.metricValues[0].value)
        }))

        // Parse Pages
        const topPages = (pagesReport?.rows || []).map((row: any) => ({
            path: row.dimensionValues[0].value,
            views: parseInt(row.metricValues[0].value)
        }))

        return NextResponse.json({
            configured: true,
            totalVisitors,
            pageViews,
            liveVisitors, // New realtime metric
            countryStats,
            trafficSources,
            topPages
        })

    } catch (error) {
        console.error("Failed to fetch GA stats", error)
        return NextResponse.json({ error: "Failed to fetch GA stats" }, { status: 500 })
    }
}
