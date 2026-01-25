"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, LineChart, Mail, Menu, Package, Settings, ShoppingCart, MessageSquare } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package className="h-6 w-6" />
                            <span className="">NursLibrary Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/admin/dashboard"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/admin/dashboard' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                            >
                                <Home className="h-4 w-4" />
                                Overview
                            </Link>
                            <Link
                                href="/admin/orders"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname?.startsWith('/admin/orders') ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Orders
                            </Link>
                            <Link
                                href="/admin/products"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname?.startsWith('/admin/products') ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                            >
                                <Package className="h-4 w-4" />
                                Products
                            </Link>
                            <Link
                                href="/admin/chat"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname?.startsWith('/admin/chat') ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                            >
                                <MessageSquare className="h-4 w-4" />
                                Live Chat
                            </Link>
                            <Link
                                href="/admin/messages"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname?.startsWith('/admin/messages') ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                            >
                                <Mail className="h-4 w-4" />
                                Messages
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="/admin/dashboard"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5" />
                                    Overview
                                </Link>
                                <Link
                                    href="/admin/orders"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Orders
                                </Link>
                                <Link
                                    href="/admin/products"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Package className="h-5 w-5" />
                                    Products
                                </Link>
                                <Link
                                    href="/admin/chat"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    Live Chat
                                </Link>
                                <Link
                                    href="/admin/messages"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Mail className="h-5 w-5" />
                                    Messages
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        {/* Search could go here */}
                    </div>
                    {/* User nav could go here */}
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
