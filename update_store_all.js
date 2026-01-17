const fs = require('fs');

const productsData = JSON.parse(fs.readFileSync('all_products.json', 'utf8'));
const products = productsData.products;

// Helper to escape strings for TS code
function escapeTs(text) {
    if (!text) return '';
    return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

// Helper to escape CSV
function escapeCsv(text) {
    if (!text) return '';
    let cleanText = text.replace(/<[^>]*>?/gm, ' ');
    cleanText = cleanText.replace(/\s\s+/g, ' ').trim();
    cleanText = cleanText.replace(/"/g, '""');
    return `"${cleanText}"`;
}

function getCategory(product) {
    const title = product.title.toLowerCase();
    const type = product.product_type ? product.product_type.toLowerCase() : '';

    if (type) return product.product_type; // Use Shopify type if available

    if (title.includes('veterinary') || title.includes('animal') || title.includes('dog') || title.includes('cat') || title.includes('horse')) return 'Veterinary';
    if (title.includes('nursing') || title.includes('nurse')) return 'Nursing';
    if (title.includes('medicine') || title.includes('clinical') || title.includes('pathology')) return 'Medicine';
    if (title.includes('surgery') || title.includes('surgical')) return 'Surgery';
    if (title.includes('pharmacology')) return 'Pharmacology';
    return 'Medical Books';
}

function getCollectionSlug(category) {
    if (!category) return 'uncategorized';
    return category.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

const newProducts = products.map(product => {
    const category = getCategory(product) || 'Medical Books';
    return {
        id: product.id.toString(),
        title: product.title,
        author: product.vendor || 'Medical Readers',
        category: category,
        collection: getCollectionSlug(category),
        price: product.variants[0] ? parseFloat(product.variants[0].price) : 0,
        description: product.body_html ? product.body_html.replace(/<[^>]*>?/gm, ' ').replace(/\s\s+/g, ' ').trim() : '',
        image: product.images[0] ? product.images[0].src : '',
        pages: Math.floor(Math.random() * (800 - 200 + 1) + 200),
        format: 'PDF'
    };
});

// Generate CSV
const csvHeader = 'id,title,author,category,collection,price,description,image,pages,format\n';
const csvRows = newProducts.map(p => {
    return `${p.id},${escapeCsv(p.title)},${escapeCsv(p.author)},${escapeCsv(p.category)},${escapeCsv(p.collection)},${p.price},${escapeCsv(p.description)},${p.image},${p.pages},${p.format}`;
});
fs.writeFileSync('products.csv', csvHeader + csvRows.join('\n'));
console.log(`Updated products.csv with ${newProducts.length} products.`);

// Generate Collections
const uniqueCategories = [...new Set(newProducts.map(p => p.category))].filter(Boolean);
const newCollections = uniqueCategories.map((cat, index) => ({
    id: (index + 1).toString(),
    name: cat,
    slug: getCollectionSlug(cat),
    description: `${cat} resources and books`
}));

const storeContent = `import type { Product, Collection } from "./types"

export const collections: Collection[] = ${JSON.stringify(newCollections, null, 2)}

export const products: Product[] = ${JSON.stringify(newProducts, null, 2)}

export function parseCSVProducts(csvText: string): Product[] {
  const lines = csvText.trim().split("\\n")
  const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return {
      id: values[0],
      title: values[1],
      author: values[2],
      category: values[3],
      collection: values[4],
      price: Number.parseFloat(values[5]),
      description: values[6],
      image: values[7],
      pages: Number.parseInt(values[8]),
      format: values[9],
    }
  })
}

export function getAllProducts(): Product[] {
  return products
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductsByCollection(collection: string): Product[] {
  return products.filter((p) => p.collection === collection)
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)))
}

export function getCollections(): Collection[] {
  return collections
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}
`;

fs.writeFileSync('lib/store.ts', storeContent);
console.log(`Updated lib/store.ts with ${newProducts.length} products and ${newCollections.length} collections.`);
