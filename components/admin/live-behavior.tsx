"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ShoppingCart, CreditCard, CheckCircle } from "lucide-react"

interface LiveBehaviorProps {
    data: {
        inCart: number
        inCheckout: number
        recentPurchases: Array<{
            visitorId: string
            time: string
            metadata: any
        }>
    }
}

export function LiveBehavior({ data }: LiveBehaviorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500 animate-pulse" />
                    Live User Behavior
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Live Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {data.inCart}
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">In Cart</p>
                                </div>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                Users with items (30 min)
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                        {data.inCheckout}
                                    </p>
                                    <p className="text-xs text-purple-700 dark:text-purple-300">In Checkout</p>
                                </div>
                            </div>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                                Active checkouts (15 min)
                            </p>
                        </div>
                    </div>

                    {/* Recent Purchases */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <h3 className="text-sm font-semibold">Recent Purchases (24h)</h3>
                        </div>

                        {data.recentPurchases.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No purchases yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {data.recentPurchases.map((purchase, index) => (
                                    <div
                                        key={`${purchase.visitorId}-${index}`}
                                        className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Visitor #{purchase.visitorId}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {purchase.metadata?.amount
                                                        ? `$${(purchase.metadata.amount / 100).toFixed(2)}`
                                                        : "Purchase completed"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">{purchase.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Live Indicator */}
                    <div className="flex items-center justify-center gap-2 pt-2 border-t">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-xs text-muted-foreground">
                            Updates every 30 seconds
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
