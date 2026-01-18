import { Header } from "@/components/header"

export const runtime = "edge"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { getCollectionBySlug } from "@/lib/store"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

async function getProducts(slug: string) {
    try {
        const db = process.env.DB as any
        if (!db) return []

        // Use LIKE for simple JSON array matching: ["slug1", "slug2"]
        // We search for "slug" (with quotes) to ensure exact match
        const { results } = await db.prepare(
            "SELECT * FROM Products WHERE collections LIKE ?"
        ).bind(`%"${slug}"%`).all()

        return results.map((p: any) => ({
            ...p,
            collections: p.collections ? JSON.parse(p.collections) : [],
            price: Number(p.price)
        }))
    } catch (error) {
        console.error("Failed to fetch products for collection:", error)
        return []
    }
}

const ITEMS_PER_PAGE = 15

export default async function CollectionPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ page?: string }>
}) {
    const { slug } = await params
    const { page } = await searchParams

    const collection = getCollectionBySlug(slug)
    const allProducts = await getProducts(slug)

    if (!collection) {
        return notFound()
    }

    // Pagination Logic
    const currentPage = Number(page) || 1
    const totalProducts = allProducts.length
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentProducts = allProducts.slice(startIndex, endIndex)

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50/50">
                {/* Collection Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <Link
                            href="/collections"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Categories
                        </Link>

                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {collection.name}
                        </h1>

                        {collection.description && (
                            <div
                                className="text-lg text-muted-foreground max-w-3xl prose prose-blue"
                                dangerouslySetInnerHTML={{ __html: collection.description }}
                            />
                        )}

                        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{totalProducts}</span> resources available
                            {totalPages > 1 && (
                                <span>• Page {currentPage} of {totalPages}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {currentProducts.length > 0 ? (
                        <>
                            <ProductGrid products={currentProducts} />

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-12">
                                    <Pagination>
                                        <PaginationContent>
                                            {currentPage > 1 && (
                                                <PaginationItem>
                                                    <PaginationPrevious href={`/collections/${slug}?page=${currentPage - 1}`} />
                                                </PaginationItem>
                                            )}

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                                                // Show first, last, current, and neighbors
                                                if (
                                                    p === 1 ||
                                                    p === totalPages ||
                                                    (p >= currentPage - 1 && p <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <PaginationItem key={p}>
                                                            <PaginationLink
                                                                href={`/collections/${slug}?page=${p}`}
                                                                isActive={p === currentPage}
                                                            >
                                                                {p}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    )
                                                }

                                                // Show ellipsis
                                                if (
                                                    (p === currentPage - 2 && currentPage > 3) ||
                                                    (p === currentPage + 2 && currentPage < totalPages - 2)
                                                ) {
                                                    return (
                                                        <PaginationItem key={p}>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                    )
                                                }

                                                return null
                                            })}

                                            {currentPage < totalPages && (
                                                <PaginationItem>
                                                    <PaginationNext href={`/collections/${slug}?page=${currentPage + 1}`} />
                                                </PaginationItem>
                                            )}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-muted-foreground">No products found in this collection.</p>
                            <Button asChild className="mt-4">
                                <Link href="/">Browse all products</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
