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


  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group relative flex flex-col h-full overflow-hidden rounded-[1.5rem] border-none bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 rounded-full bg-[#5d405c] px-3 py-1 text-[10px] font-medium text-white shadow-sm">
            Sale
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center p-4 text-center">
          <h3 className="mb-1 text-sm font-medium text-foreground leading-tight group-hover:underline decoration-primary/50 underline-offset-2" title={product.title}>
            {product.title}
          </h3>

          <p className="mb-2 text-xs text-muted-foreground line-clamp-1">
            {product.author}
          </p>

          <div className="mb-3 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded-md">
              {product.pages} pgs
            </span>
            <span className="border border-border px-1.5 py-0.5 rounded-md">
              {product.format}
            </span>
          </div>

          <div className="mt-auto flex flex-col items-center gap-0.5">
            <span className="text-xs text-red-400 line-through decoration-red-400/50">
              ${(product.price * 1.25).toFixed(2)}
            </span>
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>


        </div>
      </Card>
    </Link>
  )
}
