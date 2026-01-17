import type { Product, Collection } from "./types"

// CLOUDFLARE CSV INTEGRATION GUIDE
// ================================
//
// The products array below contains example data. To replace with your Cloudflare CSV:
//
// 1. Upload your CSV to Cloudflare R2 Storage (or use Cloudflare Workers KV)
// 2. Format your CSV with these columns:
//    id,title,author,category,collection,price,description,image,pages,format
//
// 3. Create an API route to fetch and parse the CSV:
//    - Create: app/api/products/route.ts
//    - Use this route to fetch from Cloudflare R2 URL
//    - Parse CSV and return JSON
//
// 4. Replace the hardcoded products array by:
//    - Option A: Move this to lib/products-server.ts as a Server Action
//    - Option B: Fetch from your API route at build time (next.config.js)
//    - Option C: Use dynamic fetching with SWR in components
//
// Example API route structure:
//
// // app/api/products/route.ts
// export async function GET() {
//   const csvUrl = "YOUR_CLOUDFLARE_R2_URL/products.csv"
//   const response = await fetch(csvUrl)
//   const csvText = await response.text()
//   const products = parseCSV(csvText) // Your CSV parser function
//   return Response.json(products)
// }
//
// 5. Update imports in components:
//    - Change: import { products } from "@/lib/store"
//    - To: const { data: products } = useSWR("/api/products", fetcher)

export const collections: Collection[] = [
  {
    id: "1",
    name: "Nursing Fundamentals",
    slug: "nursing-fundamentals",
    description: "Core nursing concepts and clinical skills",
  },
  {
    id: "2",
    name: "Medical-Surgical Nursing",
    slug: "medical-surgical-nursing",
    description: "Adult medical-surgical nursing practice",
  },
  {
    id: "3",
    name: "Critical Care Nursing",
    slug: "critical-care-nursing",
    description: "ICU and intensive care management",
  },
  {
    id: "4",
    name: "Pediatric Nursing",
    slug: "pediatric-nursing",
    description: "Child health and pediatric care",
  },
  {
    id: "5",
    name: "Maternal & Child Health",
    slug: "maternal-child-health",
    description: "Obstetric and neonatal nursing",
  },
  {
    id: "6",
    name: "Psychiatric Nursing",
    slug: "psychiatric-nursing",
    description: "Mental health and psychiatric care",
  },
  {
    id: "7",
    name: "Community Health",
    slug: "community-health",
    description: "Public health and community nursing",
  },
  {
    id: "8",
    name: "Pharmacology",
    slug: "pharmacology",
    description: "Drug interactions and clinical pharmacology",
  },
  {
    id: "9",
    name: "Pathophysiology",
    slug: "pathophysiology",
    description: "Disease mechanisms and clinical manifestations",
  },
  {
    id: "10",
    name: "Cardiology",
    slug: "cardiology",
    description: "Cardiac conditions and cardiovascular nursing",
  },
  {
    id: "11",
    name: "Emergency Nursing",
    slug: "emergency-nursing",
    description: "Emergency medicine and trauma nursing",
  },
  {
    id: "12",
    name: "Oncology Nursing",
    slug: "oncology-nursing",
    description: "Cancer care and oncology nursing",
  },
]

// This array is hardcoded for demonstration. Follow the guide above to integrate your CSV.
export const products: Product[] = [
  // Nursing Fundamentals
  {
    id: "1",
    title: "Nursing Fundamentals Essentials",
    author: "Dr. Sarah Mitchell",
    category: "Nursing",
    collection: "nursing-fundamentals",
    price: 49.99,
    description: "Core nursing principles, patient safety, and clinical skills.",
    image: "/medical-book-clinical-pharmacology.jpg",
    pages: 520,
    format: "PDF",
  },
  // Medical-Surgical Nursing
  {
    id: "2",
    title: "Medical-Surgical Nursing Practice",
    author: "Dr. Michael Anderson",
    category: "Nursing",
    collection: "medical-surgical-nursing",
    price: 54.99,
    description: "Comprehensive guide to adult nursing care and surgical procedures.",
    image: "/medical-book-diagnostic-imaging.jpg",
    pages: 580,
    format: "PDF",
  },
  // Critical Care Nursing
  {
    id: "3",
    title: "Critical Care Nursing Handbook",
    author: "Dr. Jennifer Lee",
    category: "Nursing",
    collection: "critical-care-nursing",
    price: 54.99,
    description: "Evidence-based protocols for ICU and intensive care nursing.",
    image: "/medical-book-cardiology-heart.jpg",
    pages: 450,
    format: "PDF",
  },
  // Pediatric Nursing
  {
    id: "4",
    title: "Pediatric Nursing: Care of Children",
    author: "Dr. David Smith",
    category: "Nursing",
    collection: "pediatric-nursing",
    price: 49.99,
    description: "Growth, development, and nursing care for pediatric patients.",
    image: "/medical-book-pediatric.jpg",
    pages: 510,
    format: "PDF",
  },
  // Maternal & Child Health
  {
    id: "5",
    title: "Obstetric and Neonatal Nursing",
    author: "Dr. Robert Jones",
    category: "Nursing",
    collection: "maternal-child-health",
    price: 59.99,
    description: "Pregnancy, labor, delivery, and postpartum nursing care.",
    image: "/medical-book-surgery.jpg",
    pages: 650,
    format: "PDF",
  },
  // Psychiatric Nursing
  {
    id: "6",
    title: "Psychiatric Mental Health Nursing",
    author: "Dr. Patricia Johnson",
    category: "Nursing",
    collection: "psychiatric-nursing",
    price: 49.99,
    description: "Mental health disorders and therapeutic nursing interventions.",
    image: "/medical-book-neurology-brain.jpg",
    pages: 620,
    format: "PDF",
  },
  // Community Health
  {
    id: "7",
    title: "Community Health Nursing Practice",
    author: "Dr. Robert Williams",
    category: "Nursing",
    collection: "community-health",
    price: 44.99,
    description: "Public health nursing and community-based care delivery.",
    image: "/medical-book-clinical-pharmacology.jpg",
    pages: 480,
    format: "PDF",
  },
  // Pharmacology
  {
    id: "8",
    title: "Clinical Pharmacology for Nurses",
    author: "Dr. Michael Zhang",
    category: "Nursing",
    collection: "pharmacology",
    price: 49.99,
    description: "Drug interactions, metabolism, and medication administration.",
    image: "/medical-book-diagnostic-imaging.jpg",
    pages: 590,
    format: "PDF",
  },
  // Pathophysiology
  {
    id: "9",
    title: "Pathophysiology: Clinical Applications",
    author: "Dr. Emily Wilson",
    category: "Nursing",
    collection: "pathophysiology",
    price: 54.99,
    description: "Disease mechanisms and nursing implications.",
    image: "/medical-book-cardiology-heart.jpg",
    pages: 520,
    format: "PDF",
  },
  // Cardiology
  {
    id: "10",
    title: "Cardiovascular Nursing Care",
    author: "Dr. James Chen",
    category: "Nursing",
    collection: "cardiology",
    price: 59.99,
    description: "Cardiac conditions, assessment, and nursing interventions.",
    image: "/medical-book-pediatric.jpg",
    pages: 680,
    format: "PDF",
  },
  // Emergency Nursing
  {
    id: "11",
    title: "Emergency Nursing Essentials",
    author: "Dr. Emily Rodriguez",
    category: "Nursing",
    collection: "emergency-nursing",
    price: 54.99,
    description: "Trauma care, emergency protocols, and rapid assessment.",
    image: "/medical-book-surgery.jpg",
    pages: 480,
    format: "PDF",
  },
  // Oncology Nursing
  {
    id: "12",
    title: "Oncology Nursing: Cancer Care Management",
    author: "Dr. Thomas Blake",
    category: "Nursing",
    collection: "oncology-nursing",
    price: 64.99,
    description: "Cancer nursing, chemotherapy, and supportive care.",
    image: "/medical-book-neurology-brain.jpg",
    pages: 720,
    format: "PDF",
  },
]

// Use this when fetching CSV from Cloudflare R2 or Workers KV
export function parseCSVProducts(csvText: string): Product[] {
  const lines = csvText.trim().split("\n")
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
