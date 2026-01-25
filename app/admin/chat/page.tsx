import { AdminChatInterface } from "@/components/admin/chat-interface"

export const runtime = "edge"

export default function AdminChatPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Live Chat</h2>
                <p className="text-muted-foreground">Manage real-time conversations with visitors.</p>
            </div>

            <AdminChatInterface />
        </div>
    )
}
