"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Mail, Calendar, CreditCard, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Image from "next/image"

interface OrderItem {
    id: string
    title: string
    price: number
    image: string
    quantity: number
}

interface Order {
    id: string
    stripe_payment_intent_id: string
    customer_email: string
    amount: number
    status: string
    items: string // JSON string
    created_at: string
}

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setOrder(data)
                } else {
                    // Handle 404
                }
            } catch (error) {
                console.error("Failed to fetch order", error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchOrder()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <h2 className="text-2xl font-bold">Order not found</h2>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const items: OrderItem[] = JSON.parse(order.items || "[]")

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            Payment Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-mono text-sm">{order.id}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Payment Intent</span>
                            <span className="font-mono text-sm">{order.stripe_payment_intent_id}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className={
                                order.status === "succeeded" ? "bg-green-500" :
                                    order.status === "processing" ? "bg-blue-500" : "bg-red-500"
                            }>
                                {order.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-bold">Total Amount</span>
                            <span className="font-bold text-xl">${order.amount.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            Customer Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Email</span>
                            <span>{order.customer_email}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Date</span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(order.created_at), "PPP p")}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        Order Items ({items.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 border-b last:border-0 pb-4 last:pb-0">
                                <div className="relative w-20 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <div className="font-bold">
                                    ${item.price.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
