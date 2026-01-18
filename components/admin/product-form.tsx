"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Product {
    id?: string
    title: string
    price: number
    description: string
    image: string
    download_link: string
    category: string
}

interface ProductFormProps {
    initialData?: Product
    isEditing?: boolean
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Product>(
        initialData || {
            title: "",
            price: 0,
            description: "",
            image: "",
            download_link: "",
            category: "",
        }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEditing ? `/api/products/${initialData?.id}` : "/api/products"
            const method = isEditing ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success(isEditing ? "Product updated" : "Product created")
                router.push("/admin/products")
                router.refresh()
            } else {
                toast.error("Failed to save product")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold tracking-tight">
                    {isEditing ? "Edit Product" : "New Product"}
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Product Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Veterinary Medicine Handbook"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="e.g. Surgery, Anatomy"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                name="image"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={handleChange}
                            />
                            {formData.image && (
                                <div className="mt-2 relative w-32 h-40 border rounded overflow-hidden">
                                    <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="download_link">Secure Download Link</Label>
                            <Input
                                id="download_link"
                                name="download_link"
                                placeholder="https://drive.google.com/..."
                                value={formData.download_link}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground">
                                This link will be emailed to the customer after purchase.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Product description..."
                                className="min-h-[150px]"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading} className="gap-2">
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                                Save Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
