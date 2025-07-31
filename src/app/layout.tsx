import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ReactQueryProvider } from "@/lib/react-query"
import { AuthProvider } from "@/components/providers/auth-provider"
import { SessionRefresh } from "@/components/session-refresh"
import { ToastProvider } from "@/contexts/toast-context"
import { TranslationProvider } from "@/contexts/translation-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "ArmEventHub - Discover Amazing Events",
    description:
        "Find and book tickets for the best events around you. From music to food, culture to art - we've got it all!",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <TranslationProvider>
                    <ReactQueryProvider>
                        <ToastProvider>
                            <AuthProvider>
                                <SessionRefresh />
                                <Navigation />
                                <main>{children}</main>
                                <Footer />
                            </AuthProvider>
                        </ToastProvider>
                    </ReactQueryProvider>
                </TranslationProvider>
            </body>
        </html>
    )
}
