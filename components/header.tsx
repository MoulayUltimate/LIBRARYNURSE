"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import { useState } from "react"
import { CartSidebar } from "@/components/cart-sidebar"

export function Header() {
  const { items, isCartOpen, setIsCartOpen } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
      )}

      <div
        className={`fixed left-0 top-0 bottom-0 w-3/4 sm:w-80 bg-background border-r border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-primary">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            <Link
              href="/"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/shipping-policy"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shipping Policy
            </Link>
          </nav>
        </div>
      </div>

      <header className="border-b border-border bg-card sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/nurslibrary-logo.png"
                  alt="NursLibrary"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <span className="text-2xl font-bold text-primary hidden sm:inline">NursLibrary</span>
              </Link>
            </div>

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
                href="/shipping-policy"
                className="text-foreground hover:text-primary font-medium transition-colors"
              >
                Shipping Policy
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
