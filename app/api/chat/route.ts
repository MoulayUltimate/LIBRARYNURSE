import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get("sessionId")
        const action = searchParams.get("action") // 'poll' | 'sessions'
        const db = process.env.DB as any

        if (!db) {
            return NextResponse.json({ error: "Database not connected" }, { status: 500 })
        }

        // Action: Poll messages for a specific session (Frontend or Admin)
        if (action === "poll" && sessionId) {
            // Get messages since last check? Or just all messages for simplicity in polling
            // For simple polling, we just return the last 50 messages
            const { results: messages } = await db.prepare(
                "SELECT * FROM ChatMessages WHERE session_id = ? ORDER BY created_at ASC LIMIT 50"
            ).bind(sessionId).all()

            return NextResponse.json({ messages })
        }

        // Action: List all active sessions (Admin)
        if (action === "sessions") {
            const { results: sessions } = await db.prepare(
                `SELECT cs.*, 
                 (SELECT COUNT(*) FROM ChatMessages cm WHERE cm.session_id = cs.id AND cm.read = 0 AND cm.sender = 'customer') as unread_count,
                 (SELECT message FROM ChatMessages cm WHERE cm.session_id = cs.id ORDER BY created_at DESC LIMIT 1) as last_message
                 FROM ChatSessions cs 
                 ORDER BY cs.updated_at DESC`
            ).all()

            return NextResponse.json({ sessions })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error) {
        console.error("Chat API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { action, sessionId, message, name, email, sender } = body
        const db = process.env.DB as any

        if (!db) {
            return NextResponse.json({ error: "Database not connected" }, { status: 500 })
        }

        // Start new session
        if (action === "start") {
            const newSessionId = crypto.randomUUID()
            await db.prepare(
                "INSERT INTO ChatSessions (id, customer_name, customer_email) VALUES (?, ?, ?)"
            ).bind(newSessionId, name, email).run()

            // Initial welcome message
            await db.prepare(
                "INSERT INTO ChatMessages (session_id, sender, message) VALUES (?, ?, ?)"
            ).bind(newSessionId, 'admin', 'Hello! How can I help you today?').run()

            return NextResponse.json({ sessionId: newSessionId })
        }

        // Send message
        if (action === "send" && sessionId && message) {
            const senderType = sender || 'customer' // 'customer' or 'admin'

            await db.prepare(
                "INSERT INTO ChatMessages (session_id, sender, message, read) VALUES (?, ?, ?, 0)"
            ).bind(sessionId, senderType, message).run()

            // Update session timestamp
            await db.prepare(
                "UPDATE ChatSessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            ).bind(sessionId).run()

            return NextResponse.json({ success: true })
        }

        // Mark as read (Admin opens chat)
        if (action === "read" && sessionId) {
            await db.prepare(
                "UPDATE ChatMessages SET read = 1 WHERE session_id = ? AND sender = 'customer'"
            ).bind(sessionId).run()
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })

    } catch (error) {
        console.error("Chat API POST Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
