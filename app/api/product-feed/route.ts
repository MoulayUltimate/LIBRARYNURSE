import { NextResponse } from "next/server"

export const runtime = "edge"

/**
 * Facebook Product Catalog Feed API
 * Returns product data in Facebook-compatible XML format
 * Use this URL in Facebook Catalog Manager
 */
export async function GET(req: Request) {
    try {
        const db = process.env.DB as any

        if (!db) {
            // Fallback: return empty feed if DB not available
            return new NextResponse(generateEmptyFeed(), {
                headers: {
                    'Content-Type': 'application/xml',
                    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                }
            })
        }

        // Fetch all products from database
        const { results: products } = await db.prepare(
            "SELECT id, title, description, price, image, category FROM Products WHERE price > 0 ORDER BY created_at DESC"
        ).all()

        // Generate XML feed
        const xml = generateProductFeed(products || [])

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            }
        })

    } catch (error) {
        console.error("Error generating product feed:", error)
        return new NextResponse(generateEmptyFeed(), {
            status: 500,
            headers: {
                'Content-Type': 'application/xml',
            }
        })
    }
}

function generateProductFeed(products: any[]): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nurslibrary.com'

    const items = products.map(product => {
        const productUrl = `${baseUrl}/products/${product.id}`
        const imageUrl = product.image?.startsWith('http')
            ? product.image
            : `${baseUrl}${product.image || '/placeholder.svg'}`

        return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title || 'Medical eBook')}</g:title>
      <g:description>${escapeXml(product.description || product.title || 'Premium medical eBook for healthcare professionals')}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:price>${product.price?.toFixed(2) || '0.00'} USD</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>NursLibrary</g:brand>
      <g:product_type>${escapeXml(product.category || 'Medical eBooks')}</g:product_type>
      <g:google_product_category>Media &gt; Books &gt; Non-Fiction &gt; Medical</g:google_product_category>
    </item>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>NursLibrary Product Catalog</title>
    <link>${baseUrl}</link>
    <description>Premium medical and veterinary eBooks for healthcare professionals</description>
    ${items}
  </channel>
</rss>`
}

function generateEmptyFeed(): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nurslibrary.com'

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>NursLibrary Product Catalog</title>
    <link>${baseUrl}</link>
    <description>Premium medical and veterinary eBooks for healthcare professionals</description>
  </channel>
</rss>`
}

function escapeXml(str: string): string {
    if (!str) return ''
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}
