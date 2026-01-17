"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import { useState } from "react"
import { CartSidebar } from "@/components/cart-sidebar"

export function Header() {
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <header className="border-b border-border bg-card sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/nurslibrary-logo.png" alt="NursLibrary" width={80} height={80} className="w-20 h-20 object-contain" />
              <span className="text-2xl font-bold text-primary hidden sm:inline">NursLibrary</span>
            </Link>

            <nav className="hidden md:flex gap-8">
              <Link href="/" className="text-foreground hover:text-primary font-medium transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary font-medium transition-colors">
                Contact
              </Link>
              <Link
                href="/returns-refunds"
                className="text-foreground hover:text-primary font-medium transition-colors"
              >
                Returns & Refunds
              </Link>
            </nav>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle shopping cart"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
