"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getProductById } from "@/lib/store"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
} from "lucide-react"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </>
  )
}

function ProductDetail({ product }: { product: any }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-80">
              <div className="relative w-full h-80">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-muted rounded p-2 cursor-pointer hover:border-primary border-2 border-transparent transition-colors"
                >
                  <div className="relative w-full h-16">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={`Product view ${i + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  {product.collection.replace(/-/g, " ").toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-1">{product.title}</h1>
              <p className="text-base text-muted-foreground mb-3">By {product.author}</p>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < 4 ? "fill-accent text-accent" : "text-muted"} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">12 Reviews</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="py-3 border-b border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                <span className="text-base line-through text-muted-foreground">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-accent font-semibold mt-1">Save ${(product.price * 0.2).toFixed(2)}</p>
            </div>

            {/* Product Quick Info */}
            <div className="grid grid-cols-3 gap-3 py-3 border-b border-border">
              <div className="text-center">
                <BookOpen size={20} className="text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Pages</p>
                <p className="font-semibold text-sm text-foreground">{product.pages}</p>
              </div>
              <div className="text-center">
                <Zap size={20} className="text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Format</p>
                <p className="font-semibold text-sm text-foreground">{product.format}</p>
              </div>
              <div className="text-center">
                <Download size={20} className="text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Access</p>
                <p className="font-semibold text-sm text-foreground">Instant</p>
              </div>
            </div>

            {/* Description */}
            <div className="py-3 border-b border-border">
              <h3 className="font-semibold text-foreground mb-1 text-sm">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
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
              <Button onClick={handleAddToCart} className="flex-1 text-sm py-2 h-auto">
                {isAdded ? "✓ Added to Cart" : "Add to Cart"}
              </Button>
              <Button variant="outline" className="w-10 h-auto py-2 bg-transparent">
                <Heart size={18} />
              </Button>
              <Button variant="outline" className="w-10 h-auto py-2 bg-transparent">
                <Share2 size={18} />
              </Button>
            </div>

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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-border">
        {/* How You Receive Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How You Receive Your Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Digital Download */}
            <Card className="p-6 border-2 border-primary/20 hover:border-primary transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Instant Digital Download</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Download your eBook immediately after purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">PDF format compatible with all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">No waiting time - access your content right away</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Download multiple times for backup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Works offline - read anywhere anytime</span>
                </li>
              </ul>
            </Card>

            {/* Email Delivery */}
            <Card className="p-6 border-2 border-primary/20 hover:border-primary transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Email Delivery</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Download link sent to your email within minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Confirmation email with order details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Link remains active for 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Customer support available if you have issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Contact us if you don't receive your email</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs Section */}
        <div className="mb-12 border-t border-border pt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 bg-muted/50 border-0">
              <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Format & Pages
              </h3>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>
                  <span className="font-semibold text-foreground">Format:</span> {product.format}
                </li>
                <li>
                  <span className="font-semibold text-foreground">Pages:</span> {product.pages}
                </li>
                <li>
                  <span className="font-semibold text-foreground">Author:</span> {product.author}
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-muted/50 border-0">
              <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                Licensing
              </h3>
              <p className="text-muted-foreground text-xs">
                This eBook is licensed for personal, non-commercial use only. Redistribution or sharing is prohibited.
              </p>
            </Card>

            <Card className="p-5 bg-muted/50 border-0">
              <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                Guarantee
              </h3>
              <p className="text-muted-foreground text-xs">
                30-day money-back guarantee. If you're not satisfied, we'll refund your purchase.
              </p>
            </Card>
          </div>
        </div>

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
                  contact@librarynurse.com with your order details.
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
                  LibraryNurse specializes in digital eBooks. All products are delivered as PDF files for instant access
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
