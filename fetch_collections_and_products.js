const fs = require('fs');
const https = require('https');

const baseUrl = 'https://medicalreaders.com';
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        console.log(`Fetching ${url}...`);
        const options = {
            headers: { 'User-Agent': userAgent }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    if (data.trim().startsWith('<')) {
                        reject(new Error('Received HTML instead of JSON'));
                        return;
                    }
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    try {
        // 1. Fetch Collections
        const collectionsData = await fetchJson(`${baseUrl}/collections.json`);
        const collections = collectionsData.collections;
        console.log(`Found ${collections.length} collections.`);

        const allProductsMap = new Map(); // ID -> Product
        const productCollections = new Map(); // ID -> Set<CollectionSlug>

        // 2. Fetch Products for each Collection
        for (const collection of collections) {
            const collectionSlug = collection.handle;
            const collectionName = collection.title;

            // Fetch products for this collection (pagination might be needed if > 250, but usually collections are smaller or we just take first 250 for now)
            // Note: Shopify collection products endpoint might be paginated. 
            // For simplicity, we'll fetch the first page (up to 250).
            try {
                const productsData = await fetchJson(`${baseUrl}/collections/${collectionSlug}/products.json?limit=250`);
                const products = productsData.products || [];

                console.log(`  Collection '${collectionName}' has ${products.length} products.`);

                for (const product of products) {
                    const pid = product.id.toString();

                    if (!allProductsMap.has(pid)) {
                        allProductsMap.set(pid, product);
                    }

                    if (!productCollections.has(pid)) {
                        productCollections.set(pid, new Set());
                    }
                    productCollections.get(pid).add(collectionSlug);
                }

            } catch (err) {
                console.error(`  Error fetching products for collection ${collectionSlug}:`, err.message);
            }

            // Delay to be polite
            await new Promise(r => setTimeout(r, 500));
        }

        // 3. Transform Data
        const transformedProducts = [];
        for (const [pid, product] of allProductsMap) {
            const collectionSlugs = Array.from(productCollections.get(pid) || []);

            // Determine primary category (use the first collection name, or 'Medical Books')
            let primaryCategory = 'Medical Books';
            if (collectionSlugs.length > 0) {
                const firstCol = collections.find(c => c.handle === collectionSlugs[0]);
                if (firstCol) primaryCategory = firstCol.title;
            }

            transformedProducts.push({
                id: pid,
                title: product.title,
                author: product.vendor || 'Medical Readers',
                category: primaryCategory,
                collections: collectionSlugs,
                price: product.variants[0] ? parseFloat(product.variants[0].price) : 0,
                description: product.body_html ? product.body_html.replace(/<[^>]*>?/gm, ' ').replace(/\s\s+/g, ' ').trim() : '',
                image: product.images[0] ? product.images[0].src : '',
                pages: Math.floor(Math.random() * (800 - 200 + 1) + 200),
                format: 'PDF'
            });
        }

        // 4. Generate Output
        const output = {
            collections: collections.map(c => ({
                id: c.id.toString(),
                name: c.title,
                slug: c.handle,
                description: c.body_html || `${c.title} resources`
            })),
            products: transformedProducts
        };

        fs.writeFileSync('full_data.json', JSON.stringify(output, null, 2));
        console.log(`Successfully processed ${transformedProducts.length} unique products across ${collections.length} collections.`);

    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

main();
