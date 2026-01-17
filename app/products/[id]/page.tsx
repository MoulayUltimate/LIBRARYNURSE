import { getProductById, getSuggestedProducts } from "@/lib/store"

export const runtime = "edge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)
  const suggestedProducts = getSuggestedProducts(id, 4)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <ProductDetail product={product} suggestedProducts={suggestedProducts} />
      <Footer />
    </>
  )
}
