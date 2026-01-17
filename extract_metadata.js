/**
 * Extract product metadata from medicalreaders.com product pages
 * This script fetches product pages and extracts ISBN, Authors, Publisher, Date, Pages, and Description
 */

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Load current products from store
const storeContent = fs.readFileSync(path.join(__dirname, 'lib/store.ts'), 'utf-8');

// Extract products array from the store file
const productsMatch = storeContent.match(/export const products: Product\[\] = (\[[\s\S]*?\]);?\s*$/m);
let products = [];
if (productsMatch) {
    try {
        // Remove comments and parse
        const productsJson = productsMatch[1];
        products = eval(productsJson);
    } catch (e) {
        console.error('Error parsing products from store:', e);
    }
}

// Alternative: load from full_data.json
const fullDataPath = path.join(__dirname, 'full_data.json');
let fullData = [];
if (fs.existsSync(fullDataPath)) {
    try {
        fullData = JSON.parse(fs.readFileSync(fullDataPath, 'utf-8'));
        console.log(`Loaded ${fullData.length} products from full_data.json`);
    } catch (e) {
        console.error('Error loading full_data.json:', e);
    }
}

/**
 * Extract metadata from a product page HTML
 * @param {string} html - The HTML content of the product page
 * @returns {object} - Extracted metadata
 */
function extractMetadataFromHTML(html) {
    const $ = cheerio.load(html);
    const metadata = {};

    // Extract accordion content by title
    const accordions = $('.product__accordion');

    accordions.each((i, el) => {
        const title = $(el).find('.accordion__title').text().trim().toLowerCase();
        const content = $(el).find('.accordion__content').text().trim();

        if (title.includes('isbn')) {
            metadata.isbn = content;
        } else if (title.includes('author')) {
            // Clean up author text (remove "by" prefix if present)
            metadata.authors = content.replace(/^by\s+/i, '').trim();
        } else if (title === 'publishers' || title === 'publisher') {
            metadata.publisher = content;
        } else if (title.includes('publisher date') || title.includes('publication date')) {
            metadata.publicationDate = content;
        } else if (title === 'pages') {
            const pagesNum = parseInt(content, 10);
            if (!isNaN(pagesNum)) {
                metadata.pages = pagesNum;
            }
        } else if (title.includes('edition')) {
            metadata.editionNumber = content;
        } else if (title.includes('copyright') || title.includes('copyright year')) {
            metadata.copyrightYear = content;
        } else if (title.includes('file size') || title.includes('filesize')) {
            metadata.fileSize = content;
        }
    });

    // Extract full description from product__description
    const descriptionEl = $('.product__description.rte');
    if (descriptionEl.length) {
        metadata.fullDescription = descriptionEl.html()?.trim();
    }

    // Fallback: try to get meta description
    if (!metadata.fullDescription) {
        const metaDesc = $('meta[name="description"]').attr('content');
        if (metaDesc) {
            metadata.description = metaDesc;
        }
    }

    return metadata;
}

/**
 * Fetch product page and extract metadata
 * @param {string} handle - Product handle/slug
 * @returns {Promise<object>} - Extracted metadata
 */
async function fetchAndExtractMetadata(handle) {
    const url = `https://medicalreaders.com/products/${handle}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch ${url}: ${response.status}`);
            return null;
        }

        const html = await response.text();
        return extractMetadataFromHTML(html);
    } catch (e) {
        console.error(`Error fetching ${url}:`, e.message);
        return null;
    }
}

/**
 * Generate product handle from title
 * @param {string} title - Product title
 * @returns {string} - URL-friendly handle
 */
function titleToHandle(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Process products and enrich with metadata
 * @param {number} limit - Maximum number of products to process (for testing)
 * @param {number} delay - Delay between requests in ms
 */
async function enrichProducts(limit = 5, delay = 1000) {
    const productsToProcess = fullData.length > 0 ? fullData : products;
    const enrichedProducts = [];

    const processLimit = Math.min(limit, productsToProcess.length);
    console.log(`Processing ${processLimit} products...`);

    for (let i = 0; i < processLimit; i++) {
        const product = productsToProcess[i];
        const handle = product.handle || titleToHandle(product.title);

        console.log(`[${i + 1}/${processLimit}] Fetching: ${product.title.substring(0, 50)}...`);

        const metadata = await fetchAndExtractMetadata(handle);

        if (metadata) {
            enrichedProducts.push({
                ...product,
                ...metadata
            });
            console.log(`  ✓ Extracted: ISBN=${metadata.isbn || 'N/A'}, Author=${metadata.author || 'N/A'}`);
        } else {
            enrichedProducts.push(product);
            console.log(`  ✗ No metadata extracted`);
        }

        // Rate limiting
        if (i < processLimit - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Save enriched data
    const outputPath = path.join(__dirname, 'enriched_products.json');
    fs.writeFileSync(outputPath, JSON.stringify(enrichedProducts, null, 2));
    console.log(`\nSaved ${enrichedProducts.length} enriched products to ${outputPath}`);

    return enrichedProducts;
}

// Test with sample HTML file first
async function testWithSampleHTML() {
    const samplePath = path.join(__dirname, 'sample_product.html');
    if (fs.existsSync(samplePath)) {
        const html = fs.readFileSync(samplePath, 'utf-8');
        const metadata = extractMetadataFromHTML(html);
        console.log('Sample extraction result:');
        console.log(JSON.stringify(metadata, null, 2));
        return metadata;
    }
    return null;
}

// Main execution
async function main() {
    console.log('=== Product Metadata Extractor ===\n');

    // Test with sample first
    console.log('Testing with sample HTML...');
    const sampleResult = await testWithSampleHTML();

    if (sampleResult && sampleResult.isbn) {
        console.log('\n✓ Sample extraction successful!\n');

        // Process all products (with 2 second delay between requests)
        await enrichProducts(9999, 2000);
        console.log('\n✓ Product enrichment complete!');
    } else {
        console.log('\n✗ Sample extraction failed or incomplete');
    }
}

main().catch(console.error);
