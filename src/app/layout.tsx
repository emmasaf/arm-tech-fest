import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "FestivalHub - Discover Amazing Festivals",
    description:
        "Find and book tickets for the best festivals around you. From music to food, culture to art - we've got it all!",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
        </body>
        </html>
    )
}
