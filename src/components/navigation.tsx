"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Calendar, Info, Mail, User, Plus } from "lucide-react"

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { href: "/", label: "Home", icon: null },
        { href: "/festivals", label: "Festivals", icon: Calendar },
        { href: "/about", label: "About", icon: Info },
        { href: "/contact", label: "Contact", icon: Mail },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">FestivalHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/register-festival">
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Register Festival
                            </Button>
                        </Link>
                        <Link href="/admin">
                            <Button variant="outline" size="sm">
                                <User className="h-4 w-4 mr-2" />
                                Admin Login
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Navigation */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col space-y-4 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors font-medium py-2"
                                    >
                                        {item.icon && <item.icon className="h-5 w-5" />}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                                <div className="pt-4 border-t space-y-2">
                                    <Link href="/register-festival" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Register Festival
                                        </Button>
                                    </Link>
                                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            <User className="h-4 w-4 mr-2" />
                                            Admin Login
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
