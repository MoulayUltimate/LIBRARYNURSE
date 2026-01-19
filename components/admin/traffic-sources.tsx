"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TrafficSourcesProps {
    sources: Array<{ source: string; visitors: number }>
}

// Source display configuration
const sourceConfig: Record<string, { label: string; color: string; icon: string }> = {
    facebook: { label: "Facebook", color: "from-blue-600 to-blue-400", icon: "📘" },
    google: { label: "Google", color: "from-red-500 to-yellow-500", icon: "🔍" },
    organic: { label: "Organic", color: "from-green-500 to-emerald-400", icon: "🌱" },
    social: { label: "Social Media", color: "from-pink-500 to-purple-500", icon: "📱" },
    direct: { label: "Direct", color: "from-gray-600 to-gray-400", icon: "🔗" }
}

export function TrafficSources({ sources }: TrafficSourcesProps) {
    if (!sources || sources.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Traffic Sources
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No traffic data yet</p>
                </CardContent>
            </Card>
        )
    }

    const totalVisitors = sources.reduce((sum, source) => sum + source.visitors, 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Traffic Sources
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Pie Chart Visualization */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                {sources.reduce((acc, source, index) => {
                                    const percentage = (source.visitors / totalVisitors) * 100
                                    const config = sourceConfig[source.source] || sourceConfig.direct

                                    // Calculate the start angle for this slice
                                    const prevPercentages = sources
                                        .slice(0, index)
                                        .reduce((sum, s) => sum + (s.visitors / totalVisitors) * 100, 0)

                                    const startAngle = (prevPercentages / 100) * 360
                                    const endAngle = ((prevPercentages + percentage) / 100) * 360

                                    // Create SVG arc path
                                    const startRad = (startAngle * Math.PI) / 180
                                    const endRad = (endAngle * Math.PI) / 180
                                    const x1 = 50 + 40 * Math.cos(startRad)
                                    const y1 = 50 + 40 * Math.sin(startRad)
                                    const x2 = 50 + 40 * Math.cos(endRad)
                                    const y2 = 50 + 40 * Math.sin(endRad)
                                    const largeArc = percentage > 50 ? 1 : 0

                                    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`

                                    const colors = [
                                        "#3b82f6", // blue
                                        "#ef4444", // red
                                        "#10b981", // green
                                        "#ec4899", // pink
                                        "#6b7280"  // gray
                                    ]

                                    acc.push(
                                        <path
                                            key={source.source}
                                            d={pathData}
                                            fill={colors[index % colors.length]}
                                            className="transition-opacity hover:opacity-80"
                                        />
                                    )

                                    return acc
                                }, [] as React.ReactElement[])}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{totalVisitors}</p>
                                    <p className="text-xs text-muted-foreground">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend with bars */}
                    <div className="space-y-3">
                        {sources.map((source) => {
                            const percentage = ((source.visitors / totalVisitors) * 100).toFixed(1)
                            const config = sourceConfig[source.source] || sourceConfig.direct

                            return (
                                <div key={source.source} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{config.icon}</span>
                                            <span className="text-sm font-medium">{config.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold">{source.visitors}</span>
                                            <span className="text-xs text-muted-foreground ml-1">({percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
