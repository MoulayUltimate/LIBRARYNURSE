"use client"

import { useEffect, useState } from "react"
import { ProductForm } from "@/components/admin/product-form"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

export default function EditProductPage() {
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setProduct(data)
                }
            } catch (error) {
                console.error("Failed to load product")
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchProduct()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!product) {
        return <div>Product not found</div>
    }

    return <ProductForm initialData={product} isEditing />
}
