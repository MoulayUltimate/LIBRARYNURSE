import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const db = process.env.DB
        if (!db) return NextResponse.json({ error: "No Database" }, { status: 500 })

        const { id } = params
        const product = await db.prepare("SELECT * FROM Products WHERE id = ?").bind(id).first()

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { title, price, description, image, download_link, category } = await req.json()
        const db = process.env.DB
        if (!db) return NextResponse.json({ error: "No Database" }, { status: 500 })

        const { id } = params

        await db.prepare(
            `UPDATE Products 
       SET title = ?, price = ?, description = ?, image = ?, download_link = ?, category = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
        ).bind(title, price, description, image, download_link, category, id).run()

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const db = process.env.DB
        if (!db) return NextResponse.json({ error: "No Database" }, { status: 500 })

        const { id } = params
        await db.prepare("DELETE FROM Products WHERE id = ?").bind(id).run()

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }
}
