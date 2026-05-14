import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/hooks/use-cart"
import { RecentSalesPopup } from "@/components/recent-sales-popup"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { MetaPixel } from "@/components/meta-pixel"
import { Suspense } from "react"
import { GoogleAnalytics } from "@/components/google-analytics"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const siteUrl = "https://www.nurslibrary.com"

export const metadata: Metadata = {
  title: {
    default: "NursLibrary — Premium Veterinary & Medical eBooks",
    template: "%s | NursLibrary",
  },
  description:
    "Shop the world's largest digital library of veterinary and medical eBooks. Instant PDF download, 500+ titles covering surgery, pharmacology, dermatology, and more. Trusted by 50,000+ veterinary professionals.",
  keywords: [
    "veterinary ebooks",
    "medical ebooks",
    "veterinary textbooks",
    "vet medicine books",
    "animal anatomy books",
    "pharmacology nursing",
    "clinical veterinary science",
    "instant download ebooks",
    "PDF veterinary books",
  ],
  authors: [{ name: "NursLibrary" }],
  creator: "NursLibrary",
  publisher: "NursLibrary",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NursLibrary",
    title: "NursLibrary — Premium Veterinary & Medical eBooks",
    description:
      "Instant access to 500+ expert-written veterinary and medical eBooks. Download immediately, read on any device.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NursLibrary — Premium Veterinary & Medical eBooks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NursLibrary — Premium Veterinary & Medical eBooks",
    description:
      "Instant access to 500+ expert-written veterinary and medical eBooks.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "NursLibrary",
    description:
      "Premium digital veterinary and medical eBooks for healthcare professionals worldwide.",
    url: siteUrl,
    logo: `${siteUrl}/nurslibrary-logo.png`,
    sameAs: [],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} ${inter.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <CartProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <Header />
          {children}
          <Footer />
          <RecentSalesPopup />
          <Analytics />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  )
}
