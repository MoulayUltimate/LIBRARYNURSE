import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/hooks/use-cart"
import { RecentSalesPopup } from "@/components/recent-sales-popup"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { MetaPixel } from "@/components/meta-pixel"
import { Suspense } from "react"
import { GoogleAnalytics } from "@/components/google-analytics"
import "./globals.css"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NursLibrary - Premium Veterinary & Medical Resources",
  description:
    "Access comprehensive veterinary and medical eBooks for professional development. Expert-written materials for students and professionals.",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-icon.png",
  },
}

import { ChatWidget } from "@/components/chat-widget"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <CartProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
          <RecentSalesPopup />
          <Analytics />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  )
}
