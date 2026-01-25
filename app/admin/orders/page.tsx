"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, Search, Mail, ShoppingCart, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { format } from "date-fns"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Order {
    id: string
    customer_email: string
    amount: number
    status: string
    created_at: string
    items: string // JSON string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("completed")

    const fetchOrders = async (type: string) => {
        setLoading(true)
        try {
            setError(null)
            const res = await fetch(`/api/orders?type=${type}`)
            if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data)) {
                    setOrders(data)
                } else {
                    setOrders([])
                }
            } else {
                setError(`Failed to load data (Status: ${res.status})`)
            }
        } catch (error) {
            console.error("Failed to fetch orders", error)
            setError("Failed to connect to server")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders(activeTab)
    }, [activeTab])

    const filteredOrders = Array.isArray(orders) ? orders.filter(order =>
        (order?.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (order?.id?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    ) : []

    const getStatusColor = (status: string) => {
        switch (status) {
            case "succeeded": return "bg-green-500 hover:bg-green-600"
            case "processing": return "bg-blue-500 hover:bg-blue-600"
            case "failed": return "bg-red-500 hover:bg-red-600"
            case "abandoned": return "bg-amber-500 hover:bg-amber-600"
            default: return "bg-gray-500 hover:bg-gray-600"
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
                <p className="text-muted-foreground">View and manage your store's orders and checkouts.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="completed" className="gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        All Orders
                    </TabsTrigger>
                    <TabsTrigger value="abandoned" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Abandoned Checkouts
                    </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by email or ID..."
                        className="max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Card>
                    <CardHeader className="p-4 border-b">
                        <CardTitle className="text-base">
                            {activeTab === 'completed' ? 'Order History' : 'Abandoned Checkouts'}
                        </CardTitle>
                        <CardDescription>
                            {activeTab === 'completed'
                                ? 'List of all successful and failed transactions.'
                                : 'Recent carts where users entered an email but did not purchase.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-destructive">
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ) : filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            No records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {order.id?.substring(0, 8)}...
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                        {order.customer_email || 'No email'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {order.created_at ? format(new Date(order.created_at), "MMM d, yyyy h:mm a") : 'N/A'}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${(order.amount || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(order.status)} capitalize shadow-none`}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {activeTab === 'abandoned' ? (
                                                    <Button variant="outline" size="sm" disabled>
                                                        Recover (Coming Soon)
                                                    </Button>
                                                ) : (
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    )
}
