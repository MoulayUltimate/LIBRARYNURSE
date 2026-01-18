"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { format } from "date-fns"

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
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders")
                if (res.ok) {
                    const data = await res.json()
                    setOrders(data)
                }
            } catch (error) {
                console.error("Failed to fetch orders", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const filteredOrders = orders.filter(order =>
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "succeeded": return "bg-green-500 hover:bg-green-600"
            case "processing": return "bg-blue-500 hover:bg-blue-600"
            case "failed": return "bg-red-500 hover:bg-red-600"
            default: return "bg-gray-500 hover:bg-gray-600"
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by email or ID..."
                            className="max-w-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
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
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">{order.id?.substring(0, 8) || 'N/A'}...</TableCell>
                                        <TableCell>{order.customer_email || 'N/A'}</TableCell>
                                        <TableCell>
                                            {order.created_at ? format(new Date(order.created_at), "MMM d, yyyy") : 'N/A'}
                                        </TableCell>
                                        <TableCell>${(order.amount || 0).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
