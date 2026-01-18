import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const adminEmail = process.env.ADMIN_EMAIL || "admin@nurslibrary.com"
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminPassword) {
            return NextResponse.json(
                { message: "Server misconfiguration: ADMIN_PASSWORD not set" },
                { status: 500 }
            )
        }

        if (email === adminEmail && password === adminPassword) {
            // Set a cookie for the session
            // In a real app, use a signed JWT or session ID
            // For simplicity here, we set a simple flag, but in production use JWT
            const cookieStore = await cookies()

            // Calculate expiration (e.g., 24 hours)
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

            cookieStore.set("admin_session", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires,
                path: "/",
            })

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
