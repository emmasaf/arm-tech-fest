"use client"

import {useState, useEffect} from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {useSession} from "next-auth/react"
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import {
    Menu,
    Calendar,
    Info,
    Mail,
    User,
    Plus,
    LogIn,
    UserPlus,
    LogOut,
    LayoutDashboard,
    Home,
    X,
    ChevronDown,
    Ticket,
    Settings,
    HelpCircle,
    Globe
} from "lucide-react"
import {useLogout} from "@/hooks/use-auth"
import {useAuth} from "@/contexts/auth-context"
import {cn} from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {LanguageSwitcher} from "@/components/language-switcher"
import {useTranslations} from "@/contexts/translation-context"

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const {data: session, status} = useSession()
    const {user, isAuthenticated} = useAuth()
    const logoutMutation = useLogout()
    const pathname = usePathname()
    const t = useTranslations()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logoutMutation.mutate()
        setIsOpen(false)
    }

    // Main navigation items - consistent order and better organization
    const navItems = [
        {href: "/", label: t('navigation.home'), icon: Home},
        {href: "/events", label: t('navigation.events'), icon: Calendar},
        {href: "/about", label: t('navigation.about'), icon: Info},
        {href: "/contact", label: t('navigation.contact'), icon: Mail},
    ]

    // User dashboard items - reorganized by frequency of use
    const userMenuItems = [
        {href: "/dashboard", label: t('navigation.dashboard'), icon: LayoutDashboard},
        {href: "/dashboard/tickets", label: t('navigation.myTickets'), icon: Ticket},
        {href: "/dashboard/profile", label: t('navigation.profile'), icon: User},
        {href: "/dashboard/settings", label: t('navigation.settings'), icon: Settings},
    ]

    // Get user initials for avatar
    const getUserInitials = (name: string | null | undefined) => {
        if (!name) return "U"
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm"
                    : "bg-white"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo - Enhanced with animation */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                    >
                        <div
                            className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <Calendar className="h-5 w-5 text-white"/>
                        </div>
                        <span
                            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            ArmEventHub
                        </span>
                    </Link>

                    {/* Desktop Navigation - Enhanced with active states */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    pathname === item.href
                                        ? "bg-purple-50 text-purple-700"
                                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50"
                                )}
                            >
                                <span className="flex items-center space-x-2">
                                    <item.icon className="h-4 w-4"/>
                                    <span>{item.label}</span>
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions - Reorganized for better UX */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {/* Language Switcher - Always visible */}
                        <LanguageSwitcher/>

                        {status === "loading" ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-lg"></div>
                                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                            </div>
                        ) : session ? (
                            <>
                                {/* Create Event Button - Primary action */}
                                <Link href={"/register-event"}>
                                    <Button
                                        size="sm"
                                        className="bg-purple-600 hover:bg-purple-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-1.5"/>
                                        {t('navigation.createEvent')}
                                    </Button>
                                </Link>


                                {/* User Dropdown Menu - Compact */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center space-x-2 px-2 hover:bg-purple-50"
                                        >
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={session.user?.image || undefined}/>
                                                <AvatarFallback className="bg-purple-600 text-white text-xs">
                                                    {getUserInitials(session.user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left hidden xl:block">
                                                <p className="text-sm font-medium leading-none">
                                                    {session.user?.name?.split(' ')[0] || 'User'}
                                                </p>
                                            </div>
                                            <ChevronDown className="h-3 w-3 text-gray-500"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">{session.user?.name}</p>
                                                <p className="text-xs text-gray-500">{session.user?.email}</p>
                                                {user?.role && (
                                                    <Badge variant="secondary" className="text-xs py-0 px-1 w-fit">
                                                        {user.role}
                                                    </Badge>
                                                )}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        {userMenuItems.map((item) => (
                                            <DropdownMenuItem key={item.href} asChild>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                    <item.icon className="h-4 w-4"/>
                                                    <span>{item.label}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={"/help"}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <HelpCircle className="h-4 w-4"/>
                                                <span>{t('navigation.helpSupport')}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            disabled={logoutMutation.isPending}
                                            className="text-red-600 cursor-pointer"
                                        >
                                            <LogOut className="h-4 w-4 mr-2"/>
                                            {logoutMutation.isPending ? t('navigation.signingOut') : t('navigation.signOut')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href={"/login"}>
                                    <Button variant="ghost" size="sm">
                                        {t('navigation.signIn')}
                                    </Button>
                                </Link>
                                <Link href={"/register-event"}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-purple-200 hover:bg-purple-50"
                                    >
                                        <Plus className="h-4 w-4 mr-1"/>
                                        {t('navigation.createEvent')}
                                    </Button>
                                </Link>
                                <Link href={"/register"}>
                                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                        {t('navigation.getStarted')}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Tablet Actions (md screens) - Improved compact version */}
                    <div className="hidden md:flex lg:hidden items-center space-x-2">
                        <LanguageSwitcher/>
                        {session ? (
                            <>
                                <Link href="/register-event">
                                    <Button size="icon" variant="outline" className="border-purple-200">
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button size="icon" variant="ghost">
                                        <LayoutDashboard className="h-4 w-4"/>
                                    </Button>
                                </Link>
                                <Button size="icon" variant="ghost" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4"/>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href={"/login"}>
                                    <Button size="sm" variant="ghost">{t('navigation.signIn')}</Button>
                                </Link>
                                <Link href={"/register"}>
                                    <Button size="sm" className="bg-purple-600">{t('navigation.getStarted')}</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Enhanced */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-purple-50"
                                aria-label={t('navigation.menu')}
                            >
                                <Menu className="h-5 w-5"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:w-80 p-0">
                            <SheetHeader className="border-b px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <SheetTitle className="text-lg">{t('navigation.menu')}</SheetTitle>
                                    <LanguageSwitcher/>
                                </div>
                            </SheetHeader>

                            <div className="flex flex-col h-full">
                                {/* User Info Section */}
                                {session && (
                                    <div className="px-6 py-4 bg-purple-50 border-b">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={session.user?.image || undefined}/>
                                                <AvatarFallback className="bg-purple-600 text-white">
                                                    {getUserInitials(session.user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{session.user?.name}</p>
                                                <p className="text-sm text-gray-600">{session.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Items */}
                                <nav className="flex-1 px-6 py-6">
                                    <div className="space-y-1">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                    pathname === item.href
                                                        ? "bg-purple-50 text-purple-700"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5"/>
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* User Menu Items */}
                                    {session && (
                                        <>
                                            <div className="my-6 border-t"></div>
                                            <div className="space-y-1">
                                                {userMenuItems.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                                                            pathname === item.href
                                                                ? "bg-purple-50 text-purple-700"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        <item.icon className="h-5 w-5"/>
                                                        <span className="font-medium">{item.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </nav>

                                {/* Bottom Actions */}
                                <div className="border-t px-6 py-4 flex flex-col gap-1">
                                    <Link href={"/register-event"} onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            <Plus className="h-4 w-4 mr-2"/>
                                            {t('navigation.createEvent')}
                                        </Button>
                                    </Link>

                                        {status === "loading" ? (
                                            <div className="space-y-3">
                                                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                            </div>
                                        ) : session ? (
                                            <Button
                                                variant="outline"
                                                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={handleLogout}
                                                disabled={logoutMutation.isPending}
                                            >
                                                <LogOut className="h-4 w-4 mr-2"/>
                                                {logoutMutation.isPending ? t('navigation.signingOut') : t('navigation.signOut')}
                                            </Button>
                                        ) : (
                                            <div className='flex flex-col gap-4'>
                                                <div className="space-y-3">
                                                    <Link href={"/login"} onClick={() => setIsOpen(false)}>
                                                        <Button variant="outline" className="w-full">
                                                            {t('navigation.signIn')}
                                                        </Button>
                                                    </Link>
                                                </div>
                                                <div className="mt-2">
                                                    <Link href={"/register"} onClick={() => setIsOpen(false)}>
                                                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                                            {t('navigation.getStarted')}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
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