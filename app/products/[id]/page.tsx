import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"

export const runtime = "edge"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  try {
    const db = process.env.DB as any
    if (!db) return null
    const product = await db.prepare("SELECT * FROM Products WHERE id = ?").bind(id).first()
    if (!product) return null
    return {
      ...product,
      collections: product.collections ? JSON.parse(product.collections) : [],
      price: Number(product.price),
      pages: product.pages ? Number(product.pages) : 0
    }
  } catch (e) {
    console.error("Error fetching product:", e)
    return null
  }
}

async function getSuggested(category: string, currentId: string) {
  try {
    const db = process.env.DB as any
    if (!db) return []
    // Fetch 4 random products from same category or just random if no category
    const { results } = await db.prepare(
      "SELECT * FROM Products WHERE category = ? AND id != ? LIMIT 4"
    ).bind(category, currentId).all()

    // If not enough, fetch random
    if (!results || results.length < 4) {
      const { results: random } = await db.prepare(
        "SELECT * FROM Products WHERE id != ? ORDER BY RANDOM() LIMIT 4"
      ).bind(currentId).all()
      return random.map((p: any) => ({
        ...p,
        collections: p.collections ? JSON.parse(p.collections) : [],
        price: Number(p.price),
        pages: p.pages ? Number(p.pages) : 0
      }))
    }

    return results.map((p: any) => ({
      ...p,
      collections: p.collections ? JSON.parse(p.collections) : [],
      price: Number(p.price),
      pages: p.pages ? Number(p.pages) : 0
    }))
  } catch (e) {
    return []
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const suggestedProducts = await getSuggested(product.category, id)

  return (
    <>
      <Header />
      <ProductDetail product={product} suggestedProducts={suggestedProducts} />
      <Footer />
    </>
  )
}
