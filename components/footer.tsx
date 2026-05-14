"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="w-full border-t border-[#bdc9c8] bg-[#e0e3e5]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3
              className="text-xl font-bold text-[#006565]"
              style={{ fontFamily: "var(--font-montserrat, Montserrat), sans-serif" }}
            >
              NursLibrary
            </h3>
            <p className="text-sm text-[#56656e] leading-relaxed">
              Premium digital veterinary and medical eBooks for healthcare professionals worldwide.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="mailto:contact@nurslibrary.com"
                className="text-[#006565] hover:text-[#008080] transition-colors text-sm font-medium"
                aria-label="Email us"
              >
                contact@nurslibrary.com
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4
              className="text-sm font-bold uppercase tracking-wider text-[#191c1e]"
              style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
            >
              Shop
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "All Collections" },
                { href: "/collections/best-sellers", label: "Bestsellers" },
                { href: "/collections/todays-deals", label: "Today's Deals" },
                { href: "/cart", label: "Shopping Cart" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#56656e] hover:text-[#006565] hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4
              className="text-sm font-bold uppercase tracking-wider text-[#191c1e]"
              style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
            >
              Support
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#56656e] hover:text-[#006565] hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4
              className="text-sm font-bold uppercase tracking-wider text-[#191c1e]"
              style={{ fontFamily: "var(--font-inter, Inter), sans-serif" }}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#56656e] hover:text-[#006565] hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#bdc9c8] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6e7979]">© 2026 NursLibrary. Verified Clinical Content.</p>
          <p className="text-sm text-[#6e7979]">www.nurslibrary.com</p>
        </div>
      </div>
    </footer>
  )
}
