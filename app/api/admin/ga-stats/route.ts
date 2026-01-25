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

                // Enhanced Mapping for common countries to ISO codes
                const nameMap: Record<string, string> = {
                    "United States": "US", "United Kingdom": "GB", "Canada": "CA",
                    "Australia": "AU", "Germany": "DE", "France": "FR", "Brazil": "BR",
                    "India": "IN", "China": "CN", "Spain": "ES", "Italy": "IT",
                    "Netherlands": "NL", "Japan": "JP", "South Korea": "KR", "Russia": "RU",
                    "Mexico": "MX", "Indonesia": "ID", "Turkey": "TR", "Saudi Arabia": "SA",
                    "Switzerland": "CH", "Sweden": "SE", "Poland": "PL", "Belgium": "BE",
                    "Austria": "AT", "Norway": "NO", "Denmark": "DK", "Finland": "FI",
                    "Ireland": "IE", "New Zealand": "NZ", "Singapore": "SG", "Portugal": "PT",
                    "Greece": "GR", "Czechia": "CZ", "Hungary": "HU", "Romania": "RO",
                    "Thailand": "TH", "Vietnam": "VN", "Philippines": "PH", "Malaysia": "MY",
                    "Egypt": "EG", "South Africa": "ZA", "Israel": "IL", "United Arab Emirates": "AE",
                    "Argentina": "AR", "Chile": "CL", "Colombia": "CO", "Peru": "PE"
                }

                // Try map first, then check if it looks like an ISO code (2 chars), else take first 2 chars
                // This is a heuristic fallback.
                let code = nameMap[name]
                if (!code) {
                    if (name.length === 2) code = name.toUpperCase()
                    else code = name.substring(0, 2).toUpperCase()
                }

                return {
                    country: code,
                    name: name,
                    visitors: parseInt(row.metricValues[0].value)
                }
            })
        }

        // Parse Sources
        // Final Fallback: If we have live visitors but NO country data (GA4 hasn't resolved geo yet),
        // show "Unknown" with the total live count so the widget isn't empty.
        if (countryStats.length === 0 && liveVisitors > 0) {
            countryStats.push({
                country: "XX",
                name: "Unknown Location",
                visitors: liveVisitors
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
