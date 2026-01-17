// Product type for medical eBooks
export type Product = {
  id: string
  title: string
  author: string
  category: string
  collection: string
  price: number
  description: string
  image: string
  pages: number
  format: string
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
