import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: Request) {
  try {
    const db = process.env.DB

    if (!db) {
      // Return mock data if no DB (for local dev without wrangler)
      return NextResponse.json([
        { id: "1", title: "Mock Product", price: 29.99, category: "Nursing" }
      ])
    }

    const { results } = await db.prepare("SELECT * FROM Products ORDER BY created_at DESC").all()
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, price, description, image, download_link, category } = await req.json()
    const db = process.env.DB

    if (!db) return NextResponse.json({ error: "No Database" }, { status: 500 })

    const id = crypto.randomUUID()

    await db.prepare(
      `INSERT INTO Products (id, title, price, description, image, download_link, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, title, price, description, image, download_link, category).run()

    return NextResponse.json({ success: true, id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
