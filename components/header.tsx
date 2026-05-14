"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import { useState } from "react"
import { CartSidebar } from "@/components/cart-sidebar"
import { usePathname } from "next/navigation"
import { SearchCommand } from "@/components/search-command"

export function Header() {
  const { items, isCartOpen, setIsCartOpen } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const navLinks = [
    { href: "/", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/shipping-policy", label: "Shipping Policy" },
  ]

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-3/4 sm:w-80 bg-[#ffffff] border-r border-[#bdc9c8] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
              <Image
                src="/nurslibrary-logo.png"
                alt="NursLibrary"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span
                className="text-xl font-bold text-[#006565]"
                style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
              >
                NursLibrary
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-[#f2f4f6] rounded-full transition-colors text-[#3e4949]"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-[#191c1e] hover:text-[#006565] hover:bg-[#f2f4f6] px-3 py-3 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-[#bdc9c8]">
            <p className="text-xs text-[#6e7979]">
              © 2026 NursLibrary. Premium Veterinary eBooks.
            </p>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className="sticky top-0 w-full z-[99] bg-white"
        style={{ boxShadow: "0 10px 30px rgba(0, 128, 128, 0.08)" }}
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="flex items-center justify-between h-20">

            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-[#3e4949] hover:bg-[#f2f4f6] rounded-full transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/nurslibrary-logo.png"
                  alt="NursLibrary"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <span
                  className="text-xl font-bold text-[#006565] hidden sm:inline"
                  style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
                >
                  NursLibrary
                </span>
              </Link>
            </div>

            {/* Center: Nav links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors pb-0.5 ${
                      isActive
                        ? "text-[#006565] border-b-2 border-[#006565]"
                        : "text-[#3e4949] hover:text-[#006565]"
                    }`}
                    style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-2">
              {/* Search — all screens */}
              <SearchCommand />

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2.5 text-[#3e4949] hover:bg-[#f2f4f6] rounded-full transition-all duration-200"
                aria-label="Toggle shopping cart"
              >
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  )
}
