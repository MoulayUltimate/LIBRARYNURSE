"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from "lucide-react"

interface CountryStatsProps {
    stats: Array<{ country: string; visitors: number }>
}

// Country code to flag emoji mapping
const countryToFlag = (countryCode: string): string => {
    if (!countryCode || countryCode === "XX") return "🌍"

    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0))

    return String.fromCodePoint(...codePoints)
}

// Country code to name mapping (common countries)
const countryNames: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    ES: "Spain",
    IT: "Italy",
    NL: "Netherlands",
    BE: "Belgium",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    PL: "Poland",
    BR: "Brazil",
    MX: "Mexico",
    AR: "Argentina",
    IN: "India",
    CN: "China",
    JP: "Japan",
    KR: "South Korea",
    SG: "Singapore",
    MY: "Malaysia",
    TH: "Thailand",
    ID: "Indonesia",
    PH: "Philippines",
    VN: "Vietnam",
    AE: "UAE",
    SA: "Saudi Arabia",
    IL: "Israel",
    TR: "Turkey",
    RU: "Russia",
    UA: "Ukraine",
    ZA: "South Africa",
    EG: "Egypt",
    NG: "Nigeria",
    KE: "Kenya",
    XX: "Unknown"
}

export function CountryStats({ stats }: CountryStatsProps) {
    if (!stats || stats.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Visitors by Country
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No visitor data yet</p>
                </CardContent>
            </Card>
        )
    }

    const totalVisitors = stats.reduce((sum, stat) => sum + stat.visitors, 0)
    const maxVisitors = Math.max(...stats.map((s) => s.visitors))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Visitors by Country
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats.map((stat, index) => {
                        const percentage = ((stat.visitors / totalVisitors) * 100).toFixed(1)
                        const barWidth = (stat.visitors / maxVisitors) * 100

                        return (
                            <div key={stat.country} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <span className="text-2xl" title={countryNames[stat.country] || stat.country}>
                                            {countryToFlag(stat.country)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">
                                                {countryNames[stat.country] || stat.country}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {stat.visitors} visitor{stat.visitors !== 1 ? "s" : ""} ({percentage}%)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold">#{index + 1}</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${barWidth}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
