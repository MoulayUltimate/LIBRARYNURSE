"use client"

import type { CartItem, Product } from "@/lib/types"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { trackEvent } from "@/components/analytics-tracker"

interface CartContextType {
  items: CartItem[]
  total: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage and recalculate total
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
      const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setTotal(newTotal)
    }
  }, [items, mounted])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prevItems, { ...product, quantity }]
    })

    // Track add to cart event
    trackEvent("add_to_cart", {
      productId: product.id,
      productTitle: product.title,
      price: product.price,
      quantity
    })

    // Auto-open cart
    setIsCartOpen(true)
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
