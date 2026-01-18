const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'lib/store.ts');
const content = fs.readFileSync(storePath, 'utf8');

// Remove imports
let jsContent = content.replace(/import .*/g, '');
// Remove type annotation
jsContent = jsContent.replace(/: Product\[\]/g, '');
jsContent = jsContent.replace(/: Collection\[\]/g, '');
// Remove export
jsContent = jsContent.replace(/export const/g, 'const');

// Remove the function definition at the end (it uses TS syntax)
const funcStart = jsContent.indexOf('export function parseCSVProducts');
if (funcStart !== -1) {
    jsContent = jsContent.substring(0, funcStart);
}

// Now we have valid JS (mostly).
// We need to extract `products`.
jsContent = `const fs = require('fs');\n` + jsContent;
jsContent += `\nfs.writeFileSync('temp_products.json', JSON.stringify(products));`;

// Write to temp file
fs.writeFileSync('temp_extract.js', jsContent);

// Run it
const { execSync } = require('child_process');
try {
    execSync('node temp_extract.js'); // No output capture needed

    if (!fs.existsSync('temp_products.json')) {
        throw new Error('temp_products.json was not created');
    }

    const json = fs.readFileSync('temp_products.json', 'utf8');
    const products = JSON.parse(json);

    // Chunk size
    const CHUNK_SIZE = 50; // Smaller chunk size to be safe
    const chunks = [];

    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
        chunks.push(products.slice(i, i + CHUNK_SIZE));
    }

    console.log(`Split ${products.length} products into ${chunks.length} chunks.`);

    // Generate SQL files
    // First chunk should delete existing products

    chunks.forEach((chunk, index) => {
        let sql = '';
        if (index === 0) {
            sql += 'DELETE FROM Products;\n';
        }

        for (const p of chunk) {
            const title = p.title.replace(/'/g, "''");
            const description = (p.description || '').replace(/'/g, "''");
            const image = Array.isArray(p.image) ? p.image[0] : (p.image || '');
            const downloadLink = p.download_link || '';
            const category = p.category || '';
            const collections = p.collections ? JSON.stringify(p.collections).replace(/'/g, "''") : '[]';

            sql += `INSERT INTO Products (id, title, price, description, image, download_link, category, collections) VALUES ('${p.id}', '${title}', ${p.price}, '${description}', '${image}', '${downloadLink}', '${category}', '${collections}');\n`;
        }

        const filename = `seed_part_${index + 1}.sql`;
        fs.writeFileSync(filename, sql);
        console.log(`Generated ${filename}`);
    });

} catch (e) {
    console.error('Error:', e.message);
} finally {
    if (fs.existsSync('temp_extract.js')) fs.unlinkSync('temp_extract.js');
    if (fs.existsSync('temp_products.json')) fs.unlinkSync('temp_products.json');
}
