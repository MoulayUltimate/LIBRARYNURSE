"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function CartSummary() {
  const { items, total } = useCart()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = total
  const finalTotal = subtotal

  return (
    <Card className="p-6 bg-card">
      <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-foreground">
          <span>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <Link href="/checkout" className="block w-full mb-2">
        <Button className="w-full" size="lg">
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/" className="block w-full">
        <Button variant="outline" className="w-full bg-transparent" size="lg">
          Continue Shopping
        </Button>
      </Link>
    </Card>
  )
}
