"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { getAllProducts } from "@/lib/store"
import type { Product } from "@/lib/types"

export function SearchCommand() {
    const [open, setOpen] = React.useState(false)
    const [products, setProducts] = React.useState<Product[]>([])
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)

        // Load products on mount
        setProducts(getAllProducts())

        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setOpen(true)}
                aria-label="Search products"
            >
                <Search className="h-5 w-5" />
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search books, authors, or categories..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        {products.slice(0, 5).map((product) => (
                            <CommandItem
                                key={product.id}
                                value={`${product.title} ${product.author} ${product.category}`}
                                onSelect={() => {
                                    runCommand(() => router.push(`/products/${product.id}`))
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Search className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span>{product.title}</span>
                                        <span className="text-xs text-muted-foreground">by {product.author}</span>
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
