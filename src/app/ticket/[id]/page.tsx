"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Calendar, MapPin, Download, Mail, Share2, CheckCircle, Loader2, AlertCircle, Clock} from "lucide-react"
import Link from "next/link"
import {useParams, useSearchParams} from "next/navigation"
import {useTicket} from "@/hooks/use-tickets"

export default function TicketPage() {
    const {id:ticketId}: { id: string, } = useParams()
    
    // Fetch ticket data from database
    const { 
        data: ticket, 
        isLoading: ticketLoading, 
        error: ticketError 
    } = useTicket(ticketId)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':')
        const date = new Date()
        date.setHours(parseInt(hours), parseInt(minutes))
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const formatPrice = (price: number, isFree: boolean) => {
        if (isFree) return "Free Entry"
        return `$${price.toFixed(2)}`
    }

    if (ticketLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your ticket...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (ticketError || !ticket) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {ticketError?.message === 'Ticket not found' ? 'Ticket Not Found' : 'Unable to Load Ticket'}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {ticketError?.message === 'Ticket not found' 
                                ? 'The ticket you\'re looking for doesn\'t exist or may have been cancelled.'
                                : 'We\'re having trouble loading your ticket. Please try again.'
                            }
                        </p>
                        <div className="space-x-4">
                            <Link href="/events">
                                <Button>
                                    Browse Events
                                </Button>
                            </Link>
                            {ticketError?.message !== 'Ticket not found' && (
                                <Button variant="outline" onClick={() => window.location.reload()}>
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Get status badge color and text
    const getStatusBadge = () => {
        switch (ticket.status) {
            case 'ACTIVE':
                return { color: 'bg-green-500', text: 'CONFIRMED' }
            case 'USED':
                return { color: 'bg-blue-500', text: 'USED' }
            case 'CANCELLED':
                return { color: 'bg-red-500', text: 'CANCELLED' }
            default:
                return { color: 'bg-gray-500', text: 'UNKNOWN' }
        }
    }

    const statusBadge = getStatusBadge()

    const handleDownload = () => {
        // In a real app, this would generate and download a PDF
        alert("PDF download functionality would be implemented here")
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `My ticket for ${ticket.event.name}`,
                text: `I'm going to ${ticket.event.name}!`,
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
                    <Card className={`${
                        ticket.status === 'CANCELLED' 
                            ? 'border-red-200 bg-red-50' 
                            : ticket.status === 'USED'
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-green-200 bg-green-50'
                    }`}>
                        <CardContent className="pt-6">
                            <div className={`flex items-center gap-3 ${
                                ticket.status === 'CANCELLED' 
                                    ? 'text-red-800' 
                                    : ticket.status === 'USED'
                                    ? 'text-blue-800'
                                    : 'text-green-800'
                            }`}>
                                <CheckCircle className="h-6 w-6"/>
                                <div>
                                    <h2 className="font-semibold">
                                        {ticket.status === 'CANCELLED' 
                                            ? 'Ticket Cancelled' 
                                            : ticket.status === 'USED'
                                            ? 'Ticket Already Used'
                                            : 'Purchase Successful!'
                                        }
                                    </h2>
                                    <p className="text-sm">
                                        {ticket.status === 'CANCELLED' 
                                            ? 'This ticket has been cancelled and is no longer valid.' 
                                            : ticket.status === 'USED'
                                            ? `This ticket was used on ${new Date(ticket.usedAt!).toLocaleDateString()}.`
                                            : 'Your ticket has been confirmed and sent to your email.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ticket */}
                <div className="max-w-2xl mx-auto">
                    <Card className="overflow-hidden scroll-fade-up scroll-delay-400">
                        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl mb-2">{ticket.event.name}</CardTitle>
                                    <CardDescription className="text-purple-100">Ticket ID: {ticket.ticketId}</CardDescription>
                                </div>
                                <Badge className={`${statusBadge.color} text-white`}>{statusBadge.text}</Badge>
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
                                            <span>{formatDate(ticket.event.startDate)}</span>
                                            {ticket.event.startDate !== ticket.event.endDate && (
                                                <span> - {formatDate(ticket.event.endDate)}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-purple-600"/>
                                            <span>{formatTime(ticket.event.startTime)} - {formatTime(ticket.event.endTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-purple-600"/>
                                            <span>{ticket.event.venueName}, {ticket.event.city}, {ticket.event.state}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3">Ticket Holder</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Name: </span>
                                            <span className="font-medium">{ticket.buyerName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Email: </span>
                                            <span className="font-medium">{ticket.buyerEmail}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Price: </span>
                                            <span className="font-medium">{formatPrice(ticket.price, ticket.event.isFree)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Purchased: </span>
                                            <span className="font-medium">{new Date(ticket.purchasedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6"/>

                            {/* QR Code */}
                            <div className="text-center scroll-scale scroll-delay-500">
                                <h3 className="font-semibold mb-4">Your Entry QR Code</h3>
                                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 inline-block hover-lift">
                                    {/* QR Code Placeholder - In real app, use a QR code library */}
                                    <div
                                        className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 mb-2">QR CODE</div>
                                            <div className="text-xs font-mono bg-gray-200 p-2 rounded max-w-[180px] break-all">{ticket.qrCodeData}</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-4">Show this QR code at the entrance for quick
                                    entry</p>
                            </div>

                            <Separator className="my-6"/>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 scroll-fade-up scroll-delay-600">
                                <Button onClick={handleDownload} className="flex-1 hover-glow">
                                    <Download className="h-4 w-4 mr-2"/>
                                    Download PDF
                                </Button>
                                <Button variant="outline" onClick={handleShare} className="flex-1 hover-lift">
                                    <Share2 className="h-4 w-4 mr-2"/>
                                    Share
                                </Button>
                                <Button variant="outline" className="flex-1 hover-lift">
                                    <Mail className="h-4 w-4 mr-2"/>
                                    Resend Email
                                </Button>
                            </div>

                            {/* Important Notes */}
                            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 scroll-fade-up scroll-delay-700">
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
                        <Link href="/events">
                            <Button variant="outline">Browse More Events</Button>
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
