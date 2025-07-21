"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Calendar, Info, Mail, User, Plus, LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react"
import { useLogout } from "@/hooks/use-auth"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const { data: session, status } = useSession()
    const { user, isAuthenticated } = useAuth()
    const logoutMutation = useLogout()
    
    const handleLogout = () => {
        logoutMutation.mutate()
        setIsOpen(false)
    }

    const navItems = [
        { href: "/", label: "Home", icon: null },
        { href: "/events", label: "Events", icon: Calendar },
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
                        <span className="text-xl font-bold text-gray-900">ArmEventHub</span>
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
                        <Link href="/register-event">
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Register Event
                            </Button>
                        </Link>
                        
                        {status === "loading" ? (
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
                                <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                        ) : session ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Hello, {session.user?.name?.split(' ')[0] || 'User'}!</span>
                                <Link href="/dashboard">
                                    <Button size="sm" className="hover-glow">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={handleLogout}
                                    disabled={logoutMutation.isPending}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {logoutMutation.isPending ? 'Signing Out...' : 'Sign Out'}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/register">
                                    <Button variant="outline" size="sm">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Register
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="sm" className="hover-glow">
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
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
                                    <Link href="/register-event" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Register Event
                                        </Button>
                                    </Link>
                                    
                                    {status === "loading" ? (
                                        <div className="space-y-2">
                                            <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
                                            <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
                                        </div>
                                    ) : session ? (
                                        <div className="space-y-2">
                                            <div className="p-2 text-sm text-gray-600 text-center">
                                                Hello, {session.user?.name?.split(' ')[0] || 'User'}!
                                            </div>
                                            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full hover-glow">
                                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                                    Dashboard
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                className="w-full"
                                                onClick={handleLogout}
                                                disabled={logoutMutation.isPending}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                {logoutMutation.isPending ? 'Signing Out...' : 'Sign Out'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <Link href="/register" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full">
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Register Account
                                                </Button>
                                            </Link>
                                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full hover-glow">
                                                    <LogIn className="h-4 w-4 mr-2" />
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
