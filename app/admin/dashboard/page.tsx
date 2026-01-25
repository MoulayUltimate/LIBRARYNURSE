"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Eye, Activity, ShoppingCart, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { CountryStats } from "@/components/admin/country-stats"
import { TrafficSources } from "@/components/admin/traffic-sources"
import { LiveBehavior } from "@/components/admin/live-behavior"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardStats {
    totalVisitors: number
    liveVisitors: number
    pageViews: number
    activeCarts: number
    successfulOrders: number
    canceledOrders: number
    abandonedCheckouts: number
    recentActivity: any[]
    topPages: Array<{ path: string; views: number }>
    deviceBreakdown: Array<{ device: string; visitors: number }>
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

const EmptyStats: DashboardStats = {
    totalVisitors: 0,
    liveVisitors: 0,
    pageViews: 0,
    activeCarts: 0,
    successfulOrders: 0,
    canceledOrders: 0,
    abandonedCheckouts: 0,
    recentActivity: [],
    topPages: [],
    deviceBreakdown: [],
    countryStats: [],
    trafficSources: [],
    liveBehavior: { inCart: 0, inCheckout: 0, recentPurchases: [] }
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>(EmptyStats)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState("today") // 'today' | '7d'

    const fetchStats = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/stats?period=${period}`)
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

    useEffect(() => {
        fetchStats()

        // Auto-refresh logic
        // If "today" is selected, refresh every 10 minutes (600000ms) as requested
        // For "7d", maybe less frequent or same. Let's stick to 10m for all or 30s for live.
        // User asked: "synchronize every 10 minutes when selecting today date"

        const refreshTime = period === "today" ? 600000 : 60000
        const interval = setInterval(fetchStats, refreshTime)

        return () => clearInterval(interval)
    }, [period])

    return (
        <div className="space-y-8 p-6 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your store's performance.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </div>

                    <Tabs value={period} onValueChange={setPeriod} className="w-[200px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="today">Today</TabsTrigger>
                            <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Button variant="outline" size="icon" onClick={fetchStats} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {period === 'today' ? "Today" : "Last 7 days"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total views</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Live Now</CardTitle>
                        <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.liveVisitors}</div>
                        <p className="text-xs text-muted-foreground">Active in last 5m</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCarts}</div>
                        <p className="text-xs text-muted-foreground">In last 24h</p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-teal-100 bg-teal-50/50 dark:bg-teal-900/10 dark:border-teal-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-400">Successful Orders</CardTitle>
                        <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{stats.successfulOrders}</div>
                        <p className="text-xs text-teal-600/80 dark:text-teal-400/80">Completed purchases</p>
                    </CardContent>
                </Card>
                <Card className="border-red-100 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Canceled/Failed</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.canceledOrders}</div>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80">Failed transactions</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-100 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">Abandoned Checkouts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.abandonedCheckouts}</div>
                        <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Active carts + Pending</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-4">
                    <CountryStats stats={stats.countryStats} />

                    {/* Top Pages Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Pages</CardTitle>
                            <CardDescription>Most visited pages during this period.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.topPages.map((page, i) => (
                                    <div key={page.path} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-sm font-medium w-6 text-muted-foreground">#{i + 1}</span>
                                            <span className="text-sm truncate" title={page.path}>{page.path}</span>
                                        </div>
                                        <span className="text-sm font-bold">{page.views}</span>
                                    </div>
                                ))}
                                {stats.topPages.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No page data available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-3 space-y-4">
                    <TrafficSources sources={stats.trafficSources} />
                    <LiveBehavior data={stats.liveBehavior} />

                    {/* Device Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Device Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.deviceBreakdown.map((device) => (
                                    <div key={device.device} className="flex items-center justify-between">
                                        <span className="text-sm capitalize">{device.device}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${(device.visitors / Math.max(...stats.deviceBreakdown.map(d => d.visitors))) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{device.visitors}</span>
                                        </div>
                                    </div>
                                ))}
                                {stats.deviceBreakdown.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No device data available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {stats.recentActivity.map((activity, i) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border-b last:border-0 border-border/40">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-lg shadow-sm">
                                        {activity.country === "XX" ? "🌍" :
                                            String.fromCodePoint(...activity.country.toUpperCase().split("").map((c: string) => 127397 + c.charCodeAt(0)))
                                        }
                                    </div>
                                    <div className="grid gap-0.5">
                                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">{activity.action}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground font-mono">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                        {stats.recentActivity.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No recent activity recorded.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
