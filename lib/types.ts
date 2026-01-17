// Product type for medical eBooks
export type Product = {
  id: string
  title: string
  author: string
  category: string
  collection: string
  collections: string[]
  price: number
  description: string
  image: string
  pages: number | string
  format: string
  isbn?: string
  authors?: string
  publisher?: string
  publicationDate?: string
  fullDescription?: string
  editionNumber?: string
  copyrightYear?: string
  fileSize?: string
}

// Cart item type
export type CartItem = Product & {
  quantity: number
}

// Order type
export type Order = {
  id: string
  items: CartItem[]
  total: number
  email: string
  createdAt: Date
}

// Collection type
export type Collection = {
  id: string
  name: string
  slug: string
  description: string
}
