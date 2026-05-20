import { NextResponse } from "next/server"

export const runtime = "edge"

// Products excluded from the GMC feed — same list as XML feed.
// Reason: GMC "Digital books not supported" disapproval.
const EXCLUDED_PRODUCT_IDS = new Set([
    '10717742825775','10738851709231','10758699548975','10740790395183',
    '10717739024687','10717816586543','10766161969455','10749373251887',
    '10717797089583','10749125886255','10717685285167','10766373847343',
    '10740886798639','10740880376111','10731307237679','10720970080559',
    '10816828473647','10732507070767','10739959136559','10750051385647',
    '10732262064431','10720930595119','10749168943407','10717789847855',
    '10720953106735','10717724836143','10816827425071','10717800726831',
    '10816828571951','10738491719983',
])
export async function GET(req: Request) {
    try {
        const db = process.env.DB as any

        if (!db) {
            // Fallback: return empty CSV if DB not available
            return new NextResponse(generateEmptyCsv(), {
                headers: {
                    'Content-Type': 'text/csv',
                    'Cache-Control': 'public, max-age=3600',
                    'Content-Disposition': 'inline; filename="product-catalog.csv"'
                }
            })
        }

        // Fetch all products from database
        const { results: products } = await db.prepare(
            "SELECT id, title, description, price, image, category FROM Products WHERE price > 0 AND (draft IS NULL OR draft = 0) ORDER BY created_at DESC"
        ).all()

        // Filter out permanently excluded products (GMC disapprovals)
        const filtered = (products || []).filter((p: any) => !EXCLUDED_PRODUCT_IDS.has(String(p.id)))

        // Generate CSV feed
        const csv = generateProductCsv(filtered)

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
                'Content-Disposition': 'inline; filename="product-catalog.csv"'
            }
        })

    } catch (error) {
        console.error("Error generating CSV product feed:", error)
        return new NextResponse(generateEmptyCsv(), {
            status: 500,
            headers: {
                'Content-Type': 'text/csv',
            }
        })
    }
}

function generateProductCsv(products: any[]): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nurslibrary.com'

    // CSV Header (Google Merchant required fields + shipping + identifier_exists + targeting)
    const header = 'id,title,description,availability,condition,price,link,image_link,brand,identifier_exists,product_type,google_product_category,target_country,content_language,shipping'

    const rows = products.map(product => {
        const productUrl = `${baseUrl}/products/${product.id}`
        const imageUrl = product.image?.startsWith('http')
            ? product.image
            : `${baseUrl}${product.image || '/placeholder.svg'}`

        return [
            escapeCsv(product.id),
            escapeCsv(product.title || 'Nursing Reference Book'),
            escapeCsv(product.description || product.title || 'Premium nursing and veterinary reference book for healthcare professionals. Physical book shipped with bundled digital PDF access.'),
            'in_stock',
            'new',
            escapeCsv(`${product.price?.toFixed(2) || '0.00'} USD`),
            escapeCsv(productUrl),
            escapeCsv(imageUrl),
            'Nurs Library',
            'no',
            escapeCsv(product.category || 'Books > Medical & Nursing Reference'),
            escapeCsv('Media > Books'),
            'US',
            'en',
            escapeCsv('US:::Standard:19.55 USD')
        ].join(',')
    })

    return [header, ...rows].join('\n')
}

function generateEmptyCsv(): string {
    return 'id,title,description,availability,condition,price,link,image_link,brand,identifier_exists,product_type,google_product_category,target_country,content_language,shipping'
}

function escapeCsv(str: string): string {
    if (!str) return '""'
    const value = String(str)
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return `"${value}"`
}
