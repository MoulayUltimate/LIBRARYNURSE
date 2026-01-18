// Update database with product data from store.ts
import { products } from './lib/store.ts';

async function updateDatabase() {
    try {
        const db = process.env.DB;
        if (!db) {
            console.error('DB environment variable not set');
            return;
        }

        console.log(`Updating ${products.length} products...`);

        // First, add the missing columns
        const alterQueries = [
            "ALTER TABLE Products ADD COLUMN author TEXT",
            "ALTER TABLE Products ADD COLUMN pages INTEGER",
            "ALTER TABLE Products ADD COLUMN format TEXT",
            "ALTER TABLE Products ADD COLUMN isbn TEXT",
            "ALTER TABLE Products ADD COLUMN authors TEXT",
            "ALTER TABLE Products ADD COLUMN publisher TEXT",
            "ALTER TABLE Products ADD COLUMN publicationDate TEXT",
            "ALTER TABLE Products ADD COLUMN fullDescription TEXT",
            "ALTER TABLE Products ADD COLUMN editionNumber TEXT",
            "ALTER TABLE Products ADD COLUMN copyrightYear TEXT",
            "ALTER TABLE Products ADD COLUMN fileSize TEXT",
            "ALTER TABLE Products ADD COLUMN handle TEXT"
        ];

        for (const query of alterQueries) {
            try {
                await db.prepare(query).run();
                console.log(`✓ Executed: ${query}`);
            } catch (e) {
                // Column might already exist, that's ok
                console.log(`  Already exists or error: ${e.message}`);
            }
        }

        // Update each product
        let updated = 0;
        for (const product of products) {
            try {
                await db.prepare(`
          UPDATE Products SET
            author = ?,
            pages = ?,
            format = ?,
            isbn = ?,
            authors = ?,
            publisher = ?,
            publicationDate = ?,
            fullDescription = ?,
            editionNumber = ?,
            copyrightYear = ?,
            fileSize = ?,
            handle = ?
          WHERE id = ?
        `).bind(
                    product.author || null,
                    product.pages || null,
                    product.format || null,
                    product.isbn || null,
                    product.authors || null,
                    product.publisher || null,
                    product.publicationDate || null,
                    product.fullDescription || null,
                    product.editionNumber || null,
                    product.copyrightYear || null,
                    product.fileSize || null,
                    product.handle || null,
                    product.id
                ).run();

                updated++;
                if (updated % 100 === 0) {
                    console.log(`Updated ${updated} products...`);
                }
            } catch (e) {
                console.error(`Error updating product ${product.id}:`, e);
            }
        }

        console.log(`\n✅ Successfully updated ${updated} products!`);
    } catch (error) {
        console.error('Error:', error);
    }
}

updateDatabase();
