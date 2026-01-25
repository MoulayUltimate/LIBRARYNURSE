"use client"

import { PayPalExpressButton } from "@/components/paypal-express-button"

import { useState } from "react"
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
                            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
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
                                        <Star key={i} size={16} className="fill-green-500 stroke-green-500" />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">12 Reviews</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-4xl font-bold text-green-600">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-muted-foreground line-through">
                                        ${(product.price * 1.25).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-green-600">Save $9.80</p>
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
                                    <p className="text-sm font-semibold">{product.format || 'PDF'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Download size={20} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Access</p>
                                    <p className="text-sm font-semibold">Instant</p>
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
                            <Button onClick={handleAddToCart} className="flex-1 text-sm py-2 h-auto" variant="outline">
                                {isAdded ? "✓ Added" : "Add to Cart"}
                            </Button>
                            <Button variant="outline" className="w-10 h-auto py-2 bg-transparent">
                                <Heart size={18} />
                            </Button>
                            <Button variant="outline" className="w-10 h-auto py-2 bg-transparent">
                                <Share2 size={18} />
                            </Button>
                        </div>

                        {/* PayPal Express Checkout */}
                        <div className="-mt-1">
                            <PayPalExpressButton product={product} quantity={quantity} />
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
                                    <p className="font-semibold text-xs text-foreground">Instant Access</p>
                                    <p className="text-xs text-muted-foreground">Download Now</p>
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
                            <h3 className="font-semibold text-foreground mb-4 text-base">How You Receive Your Product</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Digital Download */}
                                <Card className="p-4 border-2 border-primary/20 hover:border-primary transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Download className="text-primary" size={20} />
                                        </div>
                                        <h3 className="text-base font-bold text-foreground">Instant Digital Download</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Download your eBook immediately after purchase</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">PDF format compatible with all devices</span>
                                        </li>
                                    </ul>
                                </Card>

                                {/* Email Delivery */}
                                <Card className="p-4 border-2 border-primary/20 hover:border-primary transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Mail className="text-primary" size={20} />
                                        </div>
                                        <h3 className="text-base font-bold text-foreground">Email Delivery</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Download link sent to your email within minutes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-foreground">Confirmation email with order details</span>
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
                                <h4 className="font-bold text-foreground mb-1 text-sm">How do I access my eBook?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Once you complete your purchase, you'll receive a download link immediately on the order confirmation
                                    page and via email. Click the link to download your PDF file.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">Can I read on my phone or tablet?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Yes! Our PDF eBooks are compatible with all devices including smartphones, tablets, laptops, and
                                    desktop computers. Use any PDF reader app.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">What if I don't receive my email?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Check your spam folder first. If you still don't receive it, contact our support team at
                                    contact@nurslibrary.com with your order details.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">Can I share the eBook?</h4>
                                <p className="text-muted-foreground text-sm">
                                    Our eBooks are for personal use only. Sharing or distributing without permission violates our terms of
                                    service and copyright.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">What's your refund policy?</h4>
                                <p className="text-muted-foreground text-sm">
                                    We offer a 30-day money-back guarantee if you're not satisfied with your purchase. Please refer to our
                                    refund policy page for complete details.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 text-sm">Is there a physical copy?</h4>
                                <p className="text-muted-foreground text-sm">
                                    NursLibrary specializes in digital eBooks. All products are delivered as PDF files for instant access
                                    and convenience.
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
