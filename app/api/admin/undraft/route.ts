import { NextResponse } from "next/server"

export const runtime = "edge"

// POST /api/admin/undraft
//
// Plan B for re-enabling every previously-drafted product when the D1
// migration (0005_undraft_all.sql) can't be applied through wrangler.
// Hit it once after deploy and it sets draft = 0 on every row.
//
// If an ADMIN_SECRET env var is configured, callers must send it in the
// `x-admin-secret` header. Otherwise the route runs unauthenticated, matching
// the convention used by the rest of /api/admin/*.
export async function POST(req: Request) {
    try {
        const db = process.env.DB as any
        if (!db) {
            return NextResponse.json({ error: "No Database" }, { status: 500 })
        }

        const expected = process.env.ADMIN_SECRET
        if (expected) {
            const provided = req.headers.get("x-admin-secret")
            if (provided !== expected) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }
        }

        // Count drafted rows before, so the response is informative.
        const before = await db
            .prepare("SELECT COUNT(*) as count FROM Products WHERE draft = 1")
            .first()
        const draftedBefore = Number(before?.count ?? 0)

        const result = await db
            .prepare("UPDATE Products SET draft = 0 WHERE draft = 1")
            .run()

        return NextResponse.json({
            ok: true,
            previously_drafted: draftedBefore,
            updated: result?.meta?.changes ?? draftedBefore,
            message: "All products are now live.",
        })
    } catch (err: any) {
        console.error("undraft error:", err)
        return NextResponse.json(
            { error: "Failed to un-draft products", details: err?.message || String(err) },
            { status: 500 }
        )
    }
}
