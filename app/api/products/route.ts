/**
 * API Route to fetch products from Cloudflare R2 Storage
 *
 * Setup Instructions:
 * 1. Upload your products.csv to Cloudflare R2
 * 2. Get the public URL from R2 (Format: https://your-bucket.r2.cloudflarestorage.com/products.csv)
 * 3. Set environment variable: NEXT_PUBLIC_CLOUDFLARE_CSV_URL
 * 4. This route will fetch and parse the CSV on every request
 */

import { parseCSVProducts } from "@/lib/store"

export const runtime = "edge"

export async function GET() {
  try {
    const csvUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_CSV_URL

    if (!csvUrl) {
      // Return example products if CSV URL not configured
      const exampleResponse = await fetch("https://your-cloudflare-r2-bucket-url/products.csv")
      const csvText = await exampleResponse.text()
      const products = parseCSVProducts(csvText)

      return Response.json(products)
    }

    const response = await fetch(csvUrl, {
      cache: "no-store", // Disable caching to get latest data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()
    const products = parseCSVProducts(csvText)

    return Response.json(products)
  } catch (error) {
    console.error("[v0] Error fetching products from Cloudflare:", error)
    return Response.json({ error: "Failed to load products" }, { status: 500 })
  }
}
