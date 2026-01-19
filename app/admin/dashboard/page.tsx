"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Eye, Activity, ShoppingCart } from "lucide-react"
import { CountryStats } from "@/components/admin/country-stats"
import { TrafficSources } from "@/components/admin/traffic-sources"
import { LiveBehavior } from "@/components/admin/live-behavior"

interface DashboardStats {
    totalVisitors: number
    liveVisitors: number
    pageViews: number
    activeCarts: number
    recentActivity: any[]
    countryStats: Array<{ country: string; visitors: number }>
    trafficSources: Array<{ source: string; visitors: number }>
    liveBehavior: {
        inCart: number
        inCheckout: number
        recentPurchases: Array<{
            visitorId: string
            time: string
            metadata: any
        }>
    }
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
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
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats")
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (error) {
                console.error("Failed to fetch stats", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()

        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm text-muted-foreground">Live</p>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Unique visitors tracked</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Live Now</CardTitle>
                        <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.liveVisitors}</div>
                        <p className="text-xs text-muted-foreground">Active in last 5 min</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total page views</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCarts}</div>
                        <p className="text-xs text-muted-foreground">Updated in 24h</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CountryStats stats={stats.countryStats} />
                <TrafficSources sources={stats.trafficSources} />
                <LiveBehavior data={stats.liveBehavior} />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No activity yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                                        <div className="flex items-center gap-3">
                                            {activity.country && activity.country !== "XX" && (
                                                <span className="text-xl">
                                                    {String.fromCodePoint(
                                                        ...activity.country
                                                            .toUpperCase()
                                                            .split("")
                                                            .map((char: string) => 127397 + char.charCodeAt(0))
                                                    )}
                                                </span>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">{activity.user}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.action}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Manage your store efficiently.</p>

                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={async () => {
                                        if (!confirm("Are you sure you want to import products? This might take a moment.")) return;
                                        try {
                                            const res = await fetch("/api/admin/seed", { method: "POST" })
                                            const data = await res.json()
                                            if (res.ok) {
                                                alert(`Success! Imported ${data.count} products.`)
                                            } else {
                                                alert("Failed: " + (data.error || data.message))
                                            }
                                        } catch (e) {
                                            alert("Error importing products")
                                        }
                                    }}
                                >
                                    Import Products to Database
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
