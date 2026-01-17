import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { getAllProducts, getCollections } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, BookOpen } from "lucide-react"

export default function AllCollectionsPage() {
    const products = getAllProducts()
    const collections = getCollections()

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50/50">
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Browse All Categories
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore our comprehensive library of veterinary and medical resources organized by specialty.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* All Categories Grid */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold text-foreground mb-8">Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.slug}`}
                                    className="group relative overflow-hidden rounded-xl border border-border bg-white hover:border-primary/50 transition-all duration-300 hover:shadow-md"
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
                                .filter(p => p.collections.includes(collection.slug))
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
            <Footer />
        </>
    )
}
