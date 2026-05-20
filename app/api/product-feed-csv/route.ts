import { NextResponse } from "next/server"

export const runtime = "edge"

/**
 * Facebook Product Catalog Feed API - CSV Format
 * Returns product data in Facebook-compatible CSV format
 * Alternative to XML feed
 */
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

        // Generate CSV feed
        const csv = generateProductCsv(products || [])

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
