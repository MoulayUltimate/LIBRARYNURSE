"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, User, Clock, CheckCircle } from "lucide-react"

interface Session {
    id: string
    customer_name: string
    customer_email: string
    status: string
    updated_at: string
    unread_count: number
    last_message: string
}

interface Message {
    id: number
    sender: 'customer' | 'admin'
    message: string
    created_at: string
}

export function AdminChatInterface() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Poll sessions list
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/chat?action=sessions")
                if (res.ok) {
                    const data = await res.json()
                    setSessions(data.sessions)
                }
            } catch (error) {
                console.error("Failed to fetch sessions", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSessions()
        const interval = setInterval(fetchSessions, 10000)
        return () => clearInterval(interval)
    }, [])

    // Poll messages for selected session
    useEffect(() => {
        if (!selectedSession) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?action=poll&sessionId=${selectedSession.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setMessages(data.messages)

                    // Mark as read if we have unread messages
                    if (selectedSession.unread_count > 0) {
                        await fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "read", sessionId: selectedSession.id })
                        })
                        // Update local count to avoid loop
                        setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, unread_count: 0 } : s))
                    }
                }
            } catch (error) {
                console.error("Failed to fetch messages", error)
            }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [selectedSession])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !selectedSession) return

        const msgToSend = input
        setInput("")

        // Optimistic
        setMessages(prev => [...prev, { id: Date.now(), sender: 'admin', message: msgToSend, created_at: new Date().toISOString() }])

        try {
            await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "send", sessionId: selectedSession.id, message: msgToSend, sender: 'admin' })
            })
        } catch (error) {
            console.error("Failed to send", error)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
            {/* Sessions List */}
            <Card className="md:col-span-1 flex flex-col h-full">
                <CardHeader className="px-4 py-3 border-b">
                    <CardTitle className="text-lg">Inbox</CardTitle>
                    <CardDescription>
                        {sessions.length} active conversation{sessions.length !== 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>
                <div className="flex-1 overflow-y-auto">
                    {loading && sessions.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">Loading...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">No active chats</div>
                    ) : (
                        <div className="divide-y">
                            {sessions.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => setSelectedSession(session)}
                                    className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${selectedSession?.id === session.id ? "bg-secondary" : ""
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium truncate pr-2">{session.customer_name}</span>
                                        {session.unread_count > 0 && (
                                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                                {session.unread_count}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate mb-1">
                                        {session.last_message || "No messages"}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="md:col-span-2 flex flex-col h-full">
                {selectedSession ? (
                    <>
                        <CardHeader className="px-4 py-3 border-b bg-secondary/20">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {selectedSession.customer_name}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {selectedSession.customer_email}
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Active
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-4 pb-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${msg.sender === 'admin'
                                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                                        : 'bg-secondary text-foreground rounded-tl-none'
                                                    }`}
                                            >
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                                <Input
                                    placeholder="Type your reply..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
