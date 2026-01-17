const fs = require('fs');
const path = require('path');

console.log('🔄 Starting data merge process...\n');

// Read enriched products
const enrichedPath = path.join(__dirname, 'enriched_products.json');
const storePath = path.join(__dirname, 'lib/store.ts');

if (!fs.existsSync(enrichedPath)) {
    console.error('❌ enriched_products.json not found!');
    process.exit(1);
}

console.log('📖 Reading enriched_products.json...');
const enrichedProducts = JSON.parse(fs.readFileSync(enrichedPath, 'utf-8'));
console.log(`   Found ${enrichedProducts.length} enriched products\n`);

console.log('📖 Reading lib/store.ts...');
const storeContent = fs.readFileSync(storePath, 'utf-8');

// Extract the products array from store.ts
const productsMatch = storeContent.match(/export const products: Product\[\] = (\[[\s\S]*?\n\]);/);
if (!productsMatch) {
    console.error('❌ Could not find products array in store.ts');
    process.exit(1);
}

console.log('🔍 Parsing existing products...');
const productsArrayString = productsMatch[1];
const existingProducts = eval(productsArrayString); // Parse the array
console.log(`   Found ${existingProducts.length} existing products\n`);

// Create a map of enriched data by product ID
console.log('🗺️  Creating enrichment map...');
const enrichmentMap = new Map();
enrichedProducts.forEach(product => {
    enrichmentMap.set(product.id, {
        isbn: product.isbn,
        authors: product.authors,
        publisher: product.publisher,
        publicationDate: product.publicationDate,
        editionNumber: product.editionNumber,
        copyrightYear: product.copyrightYear,
        fileSize: product.fileSize,
        fullDescription: product.fullDescription
    });
});
console.log(`   Created map with ${enrichmentMap.size} enriched entries\n`);

// Merge enriched data into existing products
console.log('🔀 Merging enriched data...');
let enrichedCount = 0;
const mergedProducts = existingProducts.map(product => {
    const enrichment = enrichmentMap.get(product.id);
    if (enrichment) {
        enrichedCount++;
        return {
            ...product,
            ...Object.fromEntries(
                Object.entries(enrichment).filter(([_, value]) => value != null && value !== 'N/A')
            )
        };
    }
    return product;
});
console.log(`   ✅ Enriched ${enrichedCount} products\n`);

// Convert merged products back to TypeScript format
console.log('📝 Formatting updated products...');
const formattedProducts = JSON.stringify(mergedProducts, null, 2)
    .replace(/"(\w+)":/g, '$1:') // Remove quotes from keys
    .replace(/: "([^"]+)"/g, (match, value) => {
        // Keep quotes for string values, but format multiline strings nicely
        if (value.includes('\n') || value.length > 200) {
            return `: "${value}"`;
        }
        return match;
    });

// Replace the products array in store.ts
console.log('💾 Updating lib/store.ts...');
const newStoreContent = storeContent.replace(
    /export const products: Product\[\] = \[[\s\S]*?\n\];/,
    `export const products: Product[] = ${formattedProducts};`
);

// Create backup
const backupPath = path.join(__dirname, 'lib/store.ts.backup');
console.log(`📦 Creating backup at lib/store.ts.backup...`);
fs.writeFileSync(backupPath, storeContent);

// Write updated store
fs.writeFileSync(storePath, newStoreContent);

console.log('\n✅ SUCCESS! Data merge complete!\n');
console.log('📊 Summary:');
console.log(`   • Total products: ${existingProducts.length}`);
console.log(`   • Enriched products: ${enrichedCount}`);
console.log(`   • Backup created: lib/store.ts.backup`);
console.log(`   • Updated file: lib/store.ts\n`);

console.log('🎯 Next steps:');
console.log('   1. Restart your dev server (npm run dev)');
console.log('   2. Visit any product page to see the metadata!');
console.log('   3. Check the accordion sections for ISBN, Authors, Publisher, etc.\n');
