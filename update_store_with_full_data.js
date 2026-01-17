const fs = require('fs');

const data = JSON.parse(fs.readFileSync('full_data.json', 'utf8'));
const products = data.products;
const collections = data.collections;

const storeContent = `import type { Product, Collection } from "./types"

export const collections: Collection[] = ${JSON.stringify(collections, null, 2)}

export const products: Product[] = ${JSON.stringify(products, null, 2)}

export function parseCSVProducts(csvText: string): Product[] {
  // Legacy support or if needed for other imports
  const lines = csvText.trim().split("\\n")
  return [] // Placeholder as we are using JSON data now
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

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((p) => p.collections.includes(collectionSlug))
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
console.log(`Updated lib/store.ts with ${products.length} products and ${collections.length} collections.`);
