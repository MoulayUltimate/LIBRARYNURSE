"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash, Percent, Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Product {
    id: string
    title: string
    price: number
    category: string
    download_link?: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Bulk Edit State
    const [bulkPercentage, setBulkPercentage] = useState("")
    const [isBulkUpdating, setIsBulkUpdating] = useState(false)
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/products")
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            toast.error("Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleBulkUpdate = async () => {
        const percentage = parseFloat(bulkPercentage)
        if (isNaN(percentage)) {
            toast.error("Please enter a valid percentage")
            return
        }

        setIsBulkUpdating(true)
        try {
            const res = await fetch("/api/products/bulk-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ percentage }),
            })

            if (res.ok) {
                toast.success(`Prices updated by ${percentage}%`)
                setIsBulkDialogOpen(false)
                fetchProducts() // Refresh list
            } else {
                toast.error("Failed to update prices")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsBulkUpdating(false)
        }
    }

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <div className="flex gap-2">
                    <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Percent size={16} />
                                Bulk Price Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bulk Price Update</DialogTitle>
                                <DialogDescription>
                                    Adjust the price of ALL products by a percentage. Use negative numbers to decrease prices.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium whitespace-nowrap">Percentage (%):</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 10 or -20"
                                        value={bulkPercentage}
                                        onChange={(e) => setBulkPercentage(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Example: Enter "10" to increase prices by 10%. Enter "-10" to decrease by 10%.
                                </p>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleBulkUpdate} disabled={isBulkUpdating}>
                                    {isBulkUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : "Apply Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Link href="/admin/products/new">
                        <Button className="gap-2">
                            <Plus size={16} />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="max-w-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.title}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
