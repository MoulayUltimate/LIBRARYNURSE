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

        // 5. Realtime Users (Last 30 min)
        const realtimeReport = await getRealtimeReport(
            [], // No dimensions = total active users
            [{ name: "activeUsers" }]
        )

        // 6. Realtime Country (Fallback for new properties)
        const realtimeCountryReport = await getRealtimeReport(
            [{ name: "country" }], // Realtime doesn't support countryId cleanly in all cases, use name
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
        const liveVisitors = parseInt(realtimeReport?.rows?.[0]?.metricValues?.[0]?.value || "0")

        // Parse Countries
        let countryStats = (countriesReport?.rows || []).map((row: any) => ({
            country: row.dimensionValues[1]?.value || "XX", // ISO Code
            name: row.dimensionValues[0]?.value || "Unknown",
            visitors: parseInt(row.metricValues[0].value)
        }))

        // Fallback: If standard report is empty (new property), use Realtime data
        if (countryStats.length === 0 && realtimeCountryReport?.rows?.length > 0) {
            countryStats = realtimeCountryReport.rows.map((row: any) => {
                const name = row.dimensionValues[0].value
                // Simple Mapping for common countries since Realtime might not give ISO easily
                // Or we accept the name and let Frontend handle it (likely needs ISO for Flag)
                // Let's try to map keys used in frontend (Names -> ISO)
                const nameMap: Record<string, string> = {
                    "United States": "US", "United Kingdom": "GB", "Canada": "CA",
                    "Australia": "AU", "Germany": "DE", "France": "FR", "Brazil": "BR",
                    "India": "IN", "China": "CN", "Spain": "ES", "Italy": "IT", "Netherlands": "NL"
                }
                const code = nameMap[name] || name.substring(0, 2).toUpperCase()

                return {
                    country: code,
                    name: name,
                    visitors: parseInt(row.metricValues[0].value)
                }
            })
        }

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
