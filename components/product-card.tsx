"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { BookOpen } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 bg-muted overflow-hidden">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="mb-2">
            <p className="text-sm text-accent font-semibold">{product.category}</p>
            <h3 className="text-lg font-bold text-foreground line-clamp-2">{product.title}</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-3 flex-1">By {product.author}</p>

          <div className="flex gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{product.pages} pages</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-primary font-semibold">{product.format}</span>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            <Button onClick={handleAddToCart} className={isAdded ? "bg-accent" : ""} size="sm">
              {isAdded ? "Added!" : "Add"}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
