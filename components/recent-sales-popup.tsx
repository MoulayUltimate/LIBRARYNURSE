"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Card } from "@/components/ui/card"

// Sample data for social proof
const NAMES = [
    "John D.", "Sarah M.", "Michael B.", "Emily R.", "David K.",
    "Jessica L.", "James W.", "Jennifer H.", "Robert T.", "Lisa P.",
    "William C.", "Ashley S.", "Brian M.", "Nicole J."
]

const LOCATIONS = [
    "USA", "Canada", "New York, USA", "California, USA", "Texas, USA",
    "Toronto, Canada", "Vancouver, Canada", "Florida, USA", "Chicago, USA",
    "London, UK", "Sydney, Australia"
]

const PRODUCTS = [
    "Pathology of Laboratory Rodents",
    "Small Animal Surgery",
    "Veterinary Immunology",
    "Canine Rehabilitation",
    "Feline Medicine",
    "Equine Internal Medicine",
    "Veterinary Pharmacology",
    "Diagnostic Radiology",
    "Exotic Animal Formulary",
    "Veterinary Anesthesia"
]

export function RecentSalesPopup() {
    const pathname = usePathname()
    const [isVisible, setIsVisible] = useState(false)
    const [sale, setSale] = useState({ name: "", location: "", product: "" })

    useEffect(() => {
        // Initial delay before first popup
        const initialTimeout = setTimeout(() => {
            showRandomSale()
        }, 5000)

        return () => clearTimeout(initialTimeout)
    }, [])

    const showRandomSale = () => {
        // Select random data
        const name = NAMES[Math.floor(Math.random() * NAMES.length)]
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
        const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]

        setSale({ name, location, product })
        setIsVisible(true)

        // Hide after 6 seconds
        setTimeout(() => {
            setIsVisible(false)

            // Schedule next popup (random delay between 15-30 seconds)
            const nextDelay = Math.floor(Math.random() * 15000) + 15000
            setTimeout(showRandomSale, nextDelay)
        }, 6000)
    }

    // MOVED CHECK HERE to avoid Rules of Hooks violation (must be after hooks)
    // Also check if valid popup state
    if (pathname?.startsWith("/admin")) return null
    if (!isVisible) return null

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-500 transform hidden sm:flex ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
        >
            <Card className="p-4 shadow-lg border-border/60 backdrop-blur-sm bg-background/95 max-w-[350px] flex items-start gap-4 relative pr-8">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={14} />
                </button>

                <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="text-primary" size={20} />
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground leading-tight">
                        <span className="font-bold">{sale.name}</span> from <span className="text-muted-foreground">{sale.location}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        just purchased <span className="font-semibold text-primary">{sale.product}</span>
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                        <CheckCircle size={10} className="text-green-500" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Verified Purchase</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
