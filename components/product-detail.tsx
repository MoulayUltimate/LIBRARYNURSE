"use client"

import { ExpressBuyButton } from "@/components/express-buy-button"
import { TrustReviews } from "@/components/trust-reviews"
import { trackEvent } from "@/components/analytics-tracker"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    BookOpen,
    Download,
    Mail,
    Shield,
    Clock,
    Zap,
    Heart,
    Share2,
    Star,
    CheckCircle,
    FileText,
    Users,
    ChevronDown,
    Package,
} from "lucide-react"

interface ProductDetailProps {
    product: any
    suggestedProducts: any[]
}

export function ProductDetail({ product, suggestedProducts }: ProductDetailProps) {
    const { addItem } = useCart()
    const router = useRouter()
    const [isAdded, setIsAdded] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        addItem(product, quantity)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    // Track Product View on Mount
    useEffect(() => {
        trackEvent('view_item', {
            productId: product.id,
            productTitle: product.title,
            price: product.price,
            currency: 'USD'
        })
    }, [product])


    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-4 py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <button onClick={() => router.back()} className="hover:text-primary transition-colors">
                        ← Back to Products
                    </button>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Product Image */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="flex items-center justify-center">
                            <div className="relative w-full aspect-[3/4] max-w-md">
                                <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    fill
                                    className="object-cover rounded-2xl shadow-lg"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Save Banner */}
                        <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-3">
                            <p className="text-sm text-slate-700">
                                💰 <strong>Save up to 70%</strong> on all books, discount auto applied
                            </p>
                        </div>

                        {/* Product Header */}
                        <div>
                            <span className="inline-block bg-[#e3fffe] text-[#006565] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                                2025 BOOKS
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-base text-muted-foreground mb-4">By {product.authors || product.author}</p>

                            {/* Star Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-yellow-400 stroke-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">12 Reviews</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-4xl font-bold text-[#006565]">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-muted-foreground line-through">
                                        ${(product.price * 1.25).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-[#006565]">Save {((product.price * 0.25)).toFixed(2)} off list price</p>
                            </div>
                        </div>

                        {/* Quick Info Icons */}
                        <div className="flex items-center gap-8 pb-6 border-b border-border">
                            <div className="flex items-center gap-2">
                                <BookOpen size={20} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Pages</p>
                                    <p className="text-sm font-semibold">{product.pages || 526}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={20} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Format</p>
                                    <p className="text-sm font-semibold">Print + PDF</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Download size={20} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Shipping</p>
                                    <p className="text-sm font-semibold">4–12 days</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="flex gap-3 py-3 border-b border-border">
                            <div className="flex items-center border border-border rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1 text-muted-foreground hover:text-foreground text-sm"
                                >
                                    −
                                </button>
                                <span className="px-3 py-1 border-l border-r border-border text-center w-10 text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-1 text-muted-foreground hover:text-foreground text-sm"
                                >
                                    +
                                </button>
                            </div>
                            <Button onClick={handleAddToCart} className="flex-1 text-sm py-2 h-auto text-white">
                                {isAdded ? "✓ Added" : "Add to Cart"}
                            </Button>
                            <Button variant="outline" className="w-10 h-auto py-2 bg-transparent">
                                <Heart size={18} />
                            </Button>
                            <Button variant="outline" className="w-10 h-auto py-2 bg-transparent">
                                <Share2 size={18} />
                            </Button>
                        </div>

                        {/* Express checkout — Apple Pay / Google Pay / Link */}
                        <div className="mt-6">
                            <div className="relative mb-3">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                                    <span className="bg-background px-2 text-muted-foreground">Or fast checkout</span>
                                </div>
                            </div>
                            <ExpressBuyButton product={product} quantity={quantity} />
                        </div>

                        {/* Extended Metadata Section - Accordion Style */}
                        {(product.isbn || product.authors || product.publisher || product.publicationDate || product.pages) && (
                            <div className="py-3 border-b border-border">
                                <h3 className="font-semibold text-foreground mb-3 text-sm">
                                    Publication Details
                                </h3>
                                <div className="space-y-2">
                                    {product.isbn && (
                                        <details className="group border-b border-border last:border-0">
                                            <summary className="cursor-pointer py-3 flex items-center justify-between hover:text-primary transition-colors">
                                                <span className="text-sm font-medium">ISBN</span>
                                                <ChevronDown size={16} className="transform group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="pb-3 text-sm text-muted-foreground">
                                                {product.isbn}
                                            </div>
                                        </details>
                                    )}
                                    {product.authors && (
                                        <details className="group border-b border-border last:border-0">
                                            <summary className="cursor-pointer py-3 flex items-center justify-between hover:text-primary transition-colors">
                                                <span className="text-sm font-medium">Authors</span>
                                                <ChevronDown size={16} className="transform group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="pb-3 text-sm text-muted-foreground">
                                                {product.authors}
                                            </div>
                                        </details>
                                    )}
                                    {product.publisher && (
                                        <details className="group border-b border-border last:border-0">
                                            <summary className="cursor-pointer py-3 flex items-center justify-between hover:text-primary transition-colors">
                                                <span className="text-sm font-medium">Publishers</span>
                                                <ChevronDown size={16} className="transform group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="pb-3 text-sm text-muted-foreground">
                                                {product.publisher}
                                            </div>
                                        </details>
                                    )}
                                    {product.publicationDate && (
                                        <details className="group border-b border-border last:border-0">
                                            <summary className="cursor-pointer py-3 flex items-center justify-between hover:text-primary transition-colors">
                                                <span className="text-sm font-medium">Publisher Date</span>
                                                <ChevronDown size={16} className="transform group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="pb-3 text-sm text-muted-foreground">
                                                {product.publicationDate}
                                            </div>
                                        </details>
                                    )}
                                    {product.pages && (
                                        <details className="group border-b border-border last:border-0">
                                            <summary className="cursor-pointer py-3 flex items-center justify-between hover:text-primary transition-colors">
                                                <span className="text-sm font-medium">Pages</span>
                                                <ChevronDown size={16} className="transform group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="pb-3 text-sm text-muted-foreground">
                                                {product.pages}
                                            </div>
                                        </details>
                                    )}
                                </div>
                            </div>
                        )}



                        {/* Quantity and Add to Cart */}


                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                                <Shield size={18} className="text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-xs text-foreground">Secure Checkout</p>
                                    <p className="text-xs text-muted-foreground">SSL Encrypted</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                                <Clock size={18} className="text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-xs text-foreground">Ships in 1–2 days</p>
                                    <p className="text-xs text-muted-foreground">+ Bonus PDF Today</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                                <CheckCircle size={18} className="text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-xs text-foreground">30-Day Refund</p>
                                    <p className="text-xs text-muted-foreground">Money Back</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                                <Users size={18} className="text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-xs text-foreground">10K+ Happy</p>
                                    <p className="text-xs text-muted-foreground">Customers</p>
                                </div>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="pt-6 border-t border-border mt-6">
                            <h3 className="font-semibold text-foreground mb-3 text-base">Description</h3>
                            {product.fullDescription ? (
                                <div
                                    className="text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                                />
                            ) : (
                                <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                            )}
                        </div>

                        {/* How You Receive Section */}
                        <div className="pt-6 border-t border-border mt-6">
                            <h3 className="font-semibold text-foreground mb-4 text-base">How you receive your book</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Physical Book Shipped */}
                                <Card className="p-4 border-2 border-primary/20 hover:border-primary transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Package className="text-primary" size={20} />
                                        </div>
                                        <h3 className="text-base font-bold text-foreground">Physical Book Shipped</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Real, printed book delivered to your US address</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">$19.55 flat-rate shipping · 4–12 business days</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Tracking number emailed when your parcel ships</span>
                                        </li>
                                    </ul>
                                </Card>

                                {/* Bonus Digital PDF */}
                                <Card className="p-4 border-2 border-primary/20 hover:border-primary transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Download className="text-primary" size={20} />
                                        </div>
                                        <h3 className="text-base font-bold text-foreground">Bonus Digital PDF Copy</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Complimentary PDF emailed immediately after payment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Start reading while your book is on the way</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Compatible with any phone, tablet, or computer</span>
                                        </li>
                                    </ul>
                                </Card>
                            </div>
                        </div>

                        {/* Product Details Tabs Section */}
                        <div className="pt-6 border-t border-border mt-6">
                            <h3 className="font-semibold text-foreground mb-4 text-base">Product Information</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Card className="p-4 bg-muted/50 border-0">
                                    <h3 className="font-bold text-foreground mb-2 text-sm flex items-center gap-2">
                                        <FileText size={16} className="text-primary" />
                                        Format & Pages
                                    </h3>
                                    <ul className="space-y-1 text-muted-foreground text-xs">
                                        <li><span className="font-semibold text-foreground">Format:</span> {product.format}</li>
                                        <li><span className="font-semibold text-foreground">Pages:</span> {product.pages}</li>
                                        <li><span className="font-semibold text-foreground">Author:</span> {product.authors || product.author}</li>
                                    </ul>
                                </Card>

                                <Card className="p-4 bg-muted/50 border-0">
                                    <h3 className="font-bold text-foreground mb-2 text-sm flex items-center gap-2">
                                        <Shield size={16} className="text-primary" />
                                        Licensing
                                    </h3>
                                    <p className="text-muted-foreground text-xs">
                                        Personal, non-commercial use only.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-border">
                <TrustReviews />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 border-t border-border">
                {/* How You Receive Section */}


                {/* Suggested Products Section */}
                {suggestedProducts.length > 0 && (
                    <div className="mb-12 border-t border-border pt-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {suggestedProducts.map((suggestedProduct) => (
                                <SuggestedProductCard key={suggestedProduct.id} product={suggestedProduct} />
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                <div className="border-t border-border pt-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">Is this a real, physical book?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Yes. Every order ships a real, printed book to your US address. You also receive a complimentary digital PDF copy by email so you can start reading while your parcel is on the way.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">How much is shipping and how long does it take?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Flat-rate $19.55 USD shipping across the United States. Orders process in 1–2 business days and arrive within 4–12 business days from dispatch.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">How does the digital PDF work?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Immediately after payment we email a secure PDF download link. Valid for 30 days, works on any phone, tablet, or computer — no special app required.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">What if my book arrives damaged?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Email Contact@nurslibrary.com within 7 days with photos and we will send a free replacement.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">What's your return policy?</h4>
                                <p className="text-muted-foreground text-sm">
                                    30-day money-back guarantee on physical books. Return shipping is free for all US customers. See our Refund Policy for full details.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">Can I share my PDF copy?</h4>
                                <p className="text-muted-foreground text-sm">
                                    The PDF is licensed for personal, non-commercial use only. Sharing or redistributing it violates our Terms of Service and copyright law.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function SuggestedProductCard({ product }: { product: any }) {


    return (
        <Link href={`/products/${product.id}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="aspect-[3/4] relative bg-muted overflow-hidden">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">By {product.authors || product.author}</p>
                    <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-primary">${product.price.toFixed(2)}</span>

                    </div>
                </div>
            </Card>
        </Link>
    )
}
