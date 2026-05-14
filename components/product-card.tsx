"use client"

import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div
        className="relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-[#bdc9c8]/40 transition-all duration-200 hover:border-[#bdc9c8] group-hover:shadow-[0_10px_30px_rgba(0,128,128,0.1)]"
      >
        {/* Cover image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#eceef0]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Sale badge */}
          <div className="absolute bottom-2 left-2 bg-[#008080] text-[#e3fffe] text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Sale
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3 gap-1.5">
          <h3
            className="text-xs font-semibold text-[#191c1e] leading-snug line-clamp-2 group-hover:text-[#006565] transition-colors"
            title={product.title}
            style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
          >
            {product.title}
          </h3>

          {product.author && (
            <p className="text-[10px] text-[#6e7979] truncate">{product.author}</p>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-[#6e7979]">
            {product.pages ? (
              <span className="bg-[#f2f4f6] px-1.5 py-0.5 rounded-md">{product.pages} pgs</span>
            ) : null}
            {product.format ? (
              <span className="border border-[#bdc9c8] px-1.5 py-0.5 rounded-md">{product.format}</span>
            ) : null}
          </div>

          {/* Pricing — pinned to bottom */}
          <div className="mt-auto pt-2 flex flex-col items-start gap-0.5">
            <span className="text-[10px] text-[#ba1a1a] line-through opacity-70">
              ${(product.price * 1.25).toFixed(2)}
            </span>
            <span
              className="text-base font-bold text-[#006565]"
              style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
            >
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
