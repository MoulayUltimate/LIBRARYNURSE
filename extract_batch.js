/**
 * Extract metadata in batches for better PC performance
 * This script processes products in small batches with delays
 */

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Load missing products
const missingPath = path.join(__dirname, 'missing_metadata_products.json');
let missingProducts = [];

if (fs.existsSync(missingPath)) {
    missingProducts = JSON.parse(fs.readFileSync(missingPath, 'utf-8'));
} else {
    console.error('Error: missing_metadata_products.json not found. Run find_missing_metadata.js first.');
    process.exit(1);
}

/**
 * Extract metadata from a product page HTML
 */
function extractMetadataFromHTML(html) {
    const $ = cheerio.load(html);
    const metadata = {};

    // Extract accordion content
    const accordions = $('.product__accordion');

    accordions.each((i, el) => {
        const title = $(el).find('.accordion__title').text().trim().toLowerCase();
        const content = $(el).find('.accordion__content').text().trim();

        if (title.includes('isbn')) {
            metadata.isbn = content;
        } else if (title.includes('author')) {
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

    // Extract full description
    const descriptionEl = $('.product__description.rte');
    if (descriptionEl.length) {
        metadata.fullDescription = descriptionEl.html()?.trim();
    }

    // Fallback: meta description
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
 */
async function fetchAndExtractMetadata(handle) {
    const url = `https://medicalreaders.com/products/${handle}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
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
 * Generate handle from title
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
 * Process batch of products
 */
async function processBatch(products, batchNumber, totalBatches, delay = 3000) {
    const enrichedBatch = [];
    const total = products.length;

    console.log(`\n=== Processing Batch ${batchNumber}/${totalBatches} (${total} products) ===`);

    for (let i = 0; i < total; i++) {
        const product = products[i];
        const handle = product.handle || titleToHandle(product.title);

        console.log(`[${i + 1}/${total}] Fetching: ${product.title.substring(0, 50)}...`);

        const metadata = await fetchAndExtractMetadata(handle);

        if (metadata && (metadata.isbn || metadata.fullDescription)) {
            enrichedBatch.push({
                ...product,
                ...metadata
            });
            console.log(`  ✓ Extracted: ISBN=${metadata.isbn || 'N/A'}`);
        } else {
            enrichedBatch.push(product);
            console.log(`  ✗ No metadata found`);
        }

        // Rate limiting
        if (i < total - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return enrichedBatch;
}

/**
 * Main execution - process in batches
 */
async function main() {
    const BATCH_SIZE = parseInt(process.argv[2]) || 50; // Default 50 products per batch
    const BATCH_NUM = parseInt(process.argv[3]) || 1; // Which batch to process
    const DELAY = 3000; // 3 seconds between requests

    console.log('=== Batch Metadata Extractor ===\n');
    console.log(`Total products to process: ${missingProducts.length}`);
    console.log(`Batch size: ${BATCH_SIZE}`);
    console.log(`Processing batch: ${BATCH_NUM}`);
    console.log(`Delay between requests: ${DELAY}ms\n`);

    // Calculate batches
    const totalBatches = Math.ceil(missingProducts.length / BATCH_SIZE);
    const startIdx = (BATCH_NUM - 1) * BATCH_SIZE;
    const endIdx = Math.min(startIdx + BATCH_SIZE, missingProducts.length);

    if (BATCH_NUM > totalBatches) {
        console.error(`Error: Batch ${BATCH_NUM} exceeds total batches (${totalBatches})`);
        process.exit(1);
    }

    const batch = missingProducts.slice(startIdx, endIdx);

    console.log(`Processing products ${startIdx + 1} to ${endIdx} of ${missingProducts.length}`);

    // Process batch
    const enrichedBatch = await processBatch(batch, BATCH_NUM, totalBatches, DELAY);

    // Save batch results
    const batchOutputPath = path.join(__dirname, `batch_${BATCH_NUM}_enriched.json`);
    fs.writeFileSync(batchOutputPath, JSON.stringify(enrichedBatch, null, 2));

    console.log(`\n✓ Batch ${BATCH_NUM} complete!`);
    console.log(`Saved to: ${batchOutputPath}`);
    console.log(`\nTo process next batch, run: node extract_batch.js ${BATCH_SIZE} ${BATCH_NUM + 1}`);
}

main().catch(console.error);
