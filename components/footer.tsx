import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">LibraryNurse</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Premium digital nursing and medical eBooks for healthcare professionals worldwide.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-foreground/60 hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-foreground/60 hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns-refunds"
                  className="text-foreground/60 hover:text-primary transition-colors text-sm"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm">&copy; 2026 LibraryNurse. All rights reserved.</p>
          <div className="text-foreground/60 text-sm mt-4 sm:mt-0 text-center sm:text-right">
            <p>For support: contact@librarynurse.com</p>
            <p className="mt-2">Website: www.librarynurse.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
