"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Message {
    id: number
    name: string
    email: string
    message: string
    read: number // 0 or 1
    created_at: string
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/messages")
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (error) {
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const toggleReadStatus = async (id: number, currentStatus: number) => {
        // Optimistic update
        setMessages(messages.map(m => m.id === id ? { ...m, read: currentStatus === 1 ? 0 : 1 } : m))

        // TODO: Implement API to update status
        toast.success("Message status updated")
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        Inbox
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Message</TableHead>
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
                            ) : messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No messages found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                messages.map((msg) => (
                                    <TableRow key={msg.id} className={msg.read === 0 ? "bg-muted/30 font-medium" : ""}>
                                        <TableCell>
                                            {msg.read === 1 ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Read</Badge>
                                            ) : (
                                                <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{msg.name || "N/A"}</TableCell>
                                        <TableCell>{msg.email}</TableCell>
                                        <TableCell>{format(new Date(msg.created_at), "MMM d, yyyy")}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={msg.message}>
                                            {msg.message}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleReadStatus(msg.id, msg.read)}
                                            >
                                                {msg.read === 1 ? "Mark Unread" : "Mark Read"}
                                            </Button>
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
