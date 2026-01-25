const fs = require('fs');
const path = require('path');

// Read the store.ts file and extract products
const storeContent = fs.readFileSync(path.join(__dirname, 'lib/store.ts'), 'utf8');

// Extract just the products array
const productsMatch = storeContent.match(/export const products: Product\[\] = \[([\s\S]*?)\n\]/);
if (!productsMatch) {
    console.error('Could not find products array in store.ts');
    process.exit(1);
}

const productsJson = '[' + productsMatch[1] + ']';
const products = eval(productsJson); // Using eval for simplicity since it's our own trusted data

console.log(`Found ${products.length} products`);

// Generate UPDATE SQL statements
let sql = '-- Update products with pages and other metadata\n\n';

for (const product of products) {
    const escapeSql = (str) => {
        if (str === null || str === undefined) return 'NULL';
        return "'" + String(str).replace(/'/g, "''") + "'";
    };

    sql += `UPDATE Products SET 
  collections = ${escapeSql(JSON.stringify(product.collections))},
  author = ${escapeSql(product.author)},
  pages = ${product.pages || 'NULL'},
  format = ${escapeSql(product.format)},
  isbn = ${escapeSql(product.isbn)},
  authors = ${escapeSql(product.authors)},
  publisher = ${escapeSql(product.publisher)},
  publicationDate = ${escapeSql(product.publicationDate)},
  editionNumber = ${escapeSql(product.editionNumber)},
  copyrightYear = ${escapeSql(product.copyrightYear)},
  fileSize = ${escapeSql(product.fileSize)},
  handle = ${escapeSql(product.handle)}
WHERE id = '${product.id}';\n\n`;
}

fs.writeFileSync('update_collections.sql', sql);
console.log('✅ Generated update_collections.sql');
