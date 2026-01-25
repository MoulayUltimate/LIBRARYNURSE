"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Minus } from "lucide-react"

interface Message {
    id: number
    sender: 'customer' | 'admin'
    message: string
    created_at: string
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [step, setStep] = useState<'details' | 'chat'>('details')
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    // Poll for messages
    useEffect(() => {
        if (!sessionId || !isOpen || isMinimized) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?action=poll&sessionId=${sessionId}`)
                if (res.ok) {
                    const data = await res.json()
                    setMessages(data.messages)
                }
            } catch (error) {
                console.error("Polling error", error)
            }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 5000) // Poll every 5s
        return () => clearInterval(interval)
    }, [sessionId, isOpen, isMinimized])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Don't render on admin routes or checkout
    // MOVED CHECK HERE to avoid Rules of Hooks violation
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) return null

    const startChat = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !email) return

        setLoading(true)
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start", name, email })
            })
            const data = await res.json()
            if (data.sessionId) {
                setSessionId(data.sessionId)
                localStorage.setItem("chat_session_id", data.sessionId)
                setStep("chat")
            }
        } catch (error) {
            console.error("Failed to start chat", error)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !sessionId) return

        // Optimistic update
        const tempId = Date.now()
        setMessages(prev => [...prev, { id: tempId, sender: 'customer', message: input, created_at: new Date().toISOString() }])
        const msgToSend = input
        setInput("")

        try {
            await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "send", sessionId, message: msgToSend, sender: 'customer' })
            })
            // Polling will update the real state
        } catch (error) {
            console.error("Failed to send message", error)
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-teal-600 hover:bg-teal-700"
            >
                <MessageCircle className="h-7 w-7 text-white" />
            </Button>
        )
    }

    if (isMinimized) {
        return (
            <Button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-4 right-4 h-14 w-auto px-6 rounded-full shadow-lg z-50 bg-teal-600 hover:bg-teal-700"
            >
                <MessageCircle className="h-6 w-6 mr-2 text-white" />
                <span className="text-white text-lg">Chat</span>
            </Button>
        )
    }

    return (
        <Card className="fixed bottom-4 right-4 w-[350px] shadow-xl z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Support
                </CardTitle>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-teal-700" onClick={() => setIsMinimized(true)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 h-[400px] flex flex-col">
                {step === 'details' ? (
                    <form onSubmit={startChat} className="flex-1 flex flex-col justify-center space-y-4">
                        <div className="text-center space-y-2 mb-4">
                            <h3 className="font-semibold text-lg">Welcome!</h3>
                            <p className="text-sm text-muted-foreground">Enter your details to start chatting with us.</p>
                        </div>
                        <div className="space-y-2">
                            <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
                            <Input placeholder="Your Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                            {loading ? "Starting..." : "Start Chat"}
                        </Button>
                    </form>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.sender === 'customer'
                                            ? 'bg-teal-600 text-white rounded-tr-none'
                                            : 'bg-muted text-foreground rounded-tl-none'
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" className="bg-teal-600 hover:bg-teal-700">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
