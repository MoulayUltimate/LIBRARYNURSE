/**
 * Safely update store.ts with enriched products
 * Uses bracket counting to find the end of the products array
 */

const fs = require('fs');
const path = require('path');

console.log('=== Safely Updating store.ts ===');

// Load enriched products
const enrichedPath = path.join(__dirname, 'enriched_products.json');
const enrichedProducts = JSON.parse(fs.readFileSync(enrichedPath, 'utf-8'));
console.log(`Loaded ${enrichedProducts.length} enriched products`);

// Load store.ts
const storePath = path.join(__dirname, 'lib/store.ts');
let storeContent = fs.readFileSync(storePath, 'utf-8');

// Find start of products array
const startMarker = 'export const products: Product[] = [';
const startIndex = storeContent.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Error: Could not find products array start');
    process.exit(1);
}

console.log(`Found products array start at index ${startIndex}`);

// Find end of products array using bracket counting
let openBrackets = 0;
let endIndex = -1;
let inString = false;
let stringChar = '';
let escape = false;

// Start searching from the opening bracket of the array
const arrayStartIndex = startIndex + startMarker.length - 1; // index of '['

for (let i = arrayStartIndex; i < storeContent.length; i++) {
    const char = storeContent[i];

    if (escape) {
        escape = false;
        continue;
    }

    if (char === '\\') {
        escape = true;
        continue;
    }

    if (inString) {
        if (char === stringChar) {
            inString = false;
        }
        continue;
    }

    if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
        continue;
    }

    if (char === '[') {
        openBrackets++;
    } else if (char === ']') {
        openBrackets--;
        if (openBrackets === 0) {
            endIndex = i;
            break;
        }
    }
}

if (endIndex === -1) {
    console.error('Error: Could not find matching closing bracket for products array');
    process.exit(1);
}

console.log(`Found products array end at index ${endIndex}`);

// Construct new content
const beforeProducts = storeContent.substring(0, startIndex + startMarker.length - 1); // Up to before '['
const afterProducts = storeContent.substring(endIndex + 1); // From after ']'

const newProductsJson = JSON.stringify(enrichedProducts, null, 2);

const newContent = beforeProducts + newProductsJson + afterProducts;

// Write back to file
fs.writeFileSync(storePath, newContent);
console.log(`✓ Successfully updated lib/store.ts`);
console.log(`Total bytes: ${newContent.length}`);
