import { NextResponse } from "next/server"

export const runtime = "edge"

// Products permanently excluded from the GMC feed.
// Reason: GMC "Digital books not supported" disapproval.
// Remove an ID from this list only after confirming the title no longer
// signals a digital/ebook product to Google.
const EXCLUDED_PRODUCT_IDS = new Set([
    '10717742825775',
    '10738851709231',
    '10758699548975',
    '10740790395183',
    '10717739024687',
    '10717816586543',
    '10766161969455',
    '10749373251887',
    '10717797089583',
    '10749125886255',
    '10717685285167',
    '10766373847343',
    '10740886798639',
    '10740880376111',
    '10731307237679',
    '10720970080559',
    '10816828473647',
    '10732507070767',
    '10739959136559',
    '10750051385647',
    '10732262064431',
    '10720930595119',
    '10749168943407',
    '10717789847855',
    '10720953106735',
    '10717724836143',
    '10816827425071',
    '10717800726831',
    '10816828571951',
    '10738491719983',
])
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
            "SELECT id, title, description, price, image, category FROM Products WHERE price > 0 AND (draft IS NULL OR draft = 0) ORDER BY created_at DESC"
        ).all()

        // Filter out permanently excluded products (GMC disapprovals)
        const filtered = (products || []).filter((p: any) => !EXCLUDED_PRODUCT_IDS.has(String(p.id)))

        // Generate XML feed
        const xml = generateProductFeed(filtered)

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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nurslibrary.com'

    const items = products.map(product => {
        const productUrl = `${baseUrl}/products/${product.id}`
        const imageUrl = product.image?.startsWith('http')
            ? product.image
            : `${baseUrl}${product.image || '/placeholder.svg'}`

        return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title || 'Nursing Reference Book')}</g:title>
      <g:description>${escapeXml(product.description || product.title || 'Premium nursing and veterinary reference book for healthcare professionals. Physical book shipped with bundled digital PDF access.')}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:price>${product.price?.toFixed(2) || '0.00'} USD</g:price>
      <g:availability>in_stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Nurs Library</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${escapeXml(product.category || 'Books > Medical & Nursing Reference')}</g:product_type>
      <g:google_product_category>Media &gt; Books</g:google_product_category>
      <g:target_country>US</g:target_country>
      <g:content_language>en</g:content_language>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>19.55 USD</g:price>
        <g:min_handling_time>1</g:min_handling_time>
        <g:max_handling_time>2</g:max_handling_time>
        <g:min_transit_time>4</g:min_transit_time>
        <g:max_transit_time>12</g:max_transit_time>
      </g:shipping>
      <g:shipping_weight>0.6 kg</g:shipping_weight>
    </item>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Nurs Library Product Catalog</title>
    <link>${baseUrl}</link>
    <description>Nursing and veterinary reference books shipped across the United States, with bundled digital PDF access.</description>
    ${items}
  </channel>
</rss>`
}

function generateEmptyFeed(): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nurslibrary.com'

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Nurs Library Product Catalog</title>
    <link>${baseUrl}</link>
    <description>Nursing and veterinary reference books shipped across the United States, with bundled digital PDF access.</description>
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
