import { ProductGrid } from "@/components/product-grid"
import { getCollections } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, BookOpen } from "lucide-react"

export const runtime = "edge"

async function getProducts() {
    try {
        const db = process.env.DB as any
        if (!db) return []

        const { results } = await db.prepare("SELECT * FROM Products").all()
        return results.map((p: any) => ({
            ...p,
            collections: p.collections ? JSON.parse(p.collections) : [],
            price: Number(p.price),
            pages: p.pages ? Number(p.pages) : 0
        }))
    } catch (error) {
        console.error("Failed to fetch products:", error)
        return []
    }
}

export default async function AllCollectionsPage() {
    const products = await getProducts()
    const collections = getCollections()

    return (
        <>
            <main className="min-h-screen bg-[#f7f9fb]">
                <div className="bg-white border-b border-[#bdc9c8]" style={{ boxShadow: "0 10px 30px rgba(0,128,128,0.05)" }}>
                    <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#191c1e] mb-6"
                            style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif", letterSpacing: "-0.02em" }}>
                            Browse All Categories
                        </h1>
                        <p className="text-lg text-[#3e4949] max-w-2xl mx-auto">
                            Explore our comprehensive library of veterinary and medical resources organized by specialty.
                        </p>
                    </div>
                </div>

                <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-12">

                    {/* All Categories Grid */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold text-foreground mb-8">Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.slug}`}
                                    className="group relative overflow-hidden rounded-xl border border-[#bdc9c8]/50 bg-white hover:border-[#006565] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,128,128,0.08)]"
                                >
                                    <div className="p-6 flex flex-col items-center text-center h-full justify-center min-h-[120px]">
                                        <div className="mb-3 p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                            <BookOpen className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {collection.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Category Sections with Products */}
                    <div className="space-y-20">
                        {collections.map((collection) => {
                            const collectionProducts = products
                                .filter((p: any) => p.collections.includes(collection.slug))
                                .slice(0, 6)

                            if (collectionProducts.length === 0) return null

                            return (
                                <section key={collection.id} id={collection.slug} className="scroll-mt-24">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-border pb-4">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{collection.name}</h2>
                                            <p className="text-muted-foreground mt-1">
                                                {collectionProducts.length} preview items
                                            </p>
                                        </div>
                                        <Button asChild variant="default" className="group">
                                            <Link href={`/collections/${collection.slug}`}>
                                                View All {collection.name} <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </div>

                                    <ProductGrid products={collectionProducts} />
                                </section>
                            )
                        })}
                    </div>

                </div>
            </main>
        </>
    )
}
