"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, ShoppingCart, MessageSquare, LogOut, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: ShoppingBag },
        { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    ]

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-20">
                <h1 className="text-lg font-bold text-primary">NursLibrary Admin</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
                md:translate-x-0 md:static md:flex md:flex-col
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-primary">NursLibrary</h1>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={20} />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link href="/admin/login">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
