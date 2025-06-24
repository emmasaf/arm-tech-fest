"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Calendar, MapPin, Download, Mail, Share2, CheckCircle} from "lucide-react"
import Link from "next/link"
import {useSearchParams} from "next/navigation"

// Mock data - replace with actual data fetching
const festivals = [
    {
        id: 1,
        title: "Summer Music Fest 2024",
        date: "2024-07-15",
        time: "2:00 PM - 11:00 PM",
        location: "Central Park, NYC",
        address: "Central Park, New York, NY 10024",
        price: 89,
        organizer: "NYC Music Events",
    },
]

interface PageProps {
    params: {
        id: string
    }
}

export default function TicketPage({params}: PageProps) {
    const searchParams = useSearchParams()
    const [qrCodeData, setQrCodeData] = useState("")

    const ticketId = params.id
    const festivalId = searchParams.get("festivalId")
    const holderName = searchParams.get("name")
    const holderEmail = searchParams.get("email")

    const festival = festivals.find((f) => f.id === Number.parseInt(festivalId || "1"))

    useEffect(() => {
        // Generate QR code data (in real app, this would be more secure)
        const qrData = `TICKET:${ticketId}:${festivalId}:${holderName}:${Date.now()}`
        setQrCodeData(qrData)
    }, [ticketId, festivalId, holderName])

    if (!festival) {
        return <div>Festival not found</div>
    }

    const handleDownload = () => {
        // In a real app, this would generate and download a PDF
        alert("PDF download functionality would be implemented here")
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `My ticket for ${festival.title}`,
                text: `I'm going to ${festival.title}!`,
                url: window.location.href,
            })
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Success Message */}
                <div className="max-w-2xl mx-auto mb-8">
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 text-green-800">
                                <CheckCircle className="h-6 w-6"/>
                                <div>
                                    <h2 className="font-semibold">Purchase Successful!</h2>
                                    <p className="text-sm">Your ticket has been confirmed and sent to your email.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ticket */}
                <div className="max-w-2xl mx-auto">
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl mb-2">{festival.title}</CardTitle>
                                    <CardDescription className="text-purple-100">Ticket ID: {ticketId}</CardDescription>
                                </div>
                                <Badge className="bg-white text-purple-600">CONFIRMED</Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* Event Details */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Event Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-purple-600"/>
                                            <span>
                        {new Date(festival.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                      </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-purple-600"/>
                                            <span>{festival.location}</span>
                                        </div>
                                        <div className="text-gray-600">{festival.time}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3">Ticket Holder</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Name: </span>
                                            <span className="font-medium">{holderName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Email: </span>
                                            <span className="font-medium">{holderEmail}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Price: </span>
                                            <span className="font-medium">${festival.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6"/>

                            {/* QR Code */}
                            <div className="text-center">
                                <h3 className="font-semibold mb-4">Your Entry QR Code</h3>
                                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 inline-block">
                                    {/* QR Code Placeholder - In real app, use a QR code library */}
                                    <div
                                        className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 mb-2">QR CODE</div>
                                            <div className="text-xs font-mono bg-gray-200 p-2 rounded">{ticketId}</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-4">Show this QR code at the entrance for quick
                                    entry</p>
                            </div>

                            <Separator className="my-6"/>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={handleDownload} className="flex-1">
                                    <Download className="h-4 w-4 mr-2"/>
                                    Download PDF
                                </Button>
                                <Button variant="outline" onClick={handleShare} className="flex-1">
                                    <Share2 className="h-4 w-4 mr-2"/>
                                    Share
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Mail className="h-4 w-4 mr-2"/>
                                    Resend Email
                                </Button>
                            </div>

                            {/* Important Notes */}
                            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="font-semibold text-yellow-800 mb-2">Important Reminders</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• Bring a valid ID that matches the ticket holder name</li>
                                    <li>• Arrive 30 minutes before the event starts</li>
                                    <li>• Keep your phone charged to display the QR code</li>
                                    <li>• Screenshot this page as backup</li>
                                    <li>• Contact support if you have any issues</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Link href="/festivals">
                            <Button variant="outline">Browse More Festivals</Button>
                        </Link>
                        <Link href="/">
                            <Button>Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
