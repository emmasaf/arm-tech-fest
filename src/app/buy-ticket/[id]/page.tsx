"use client"

import type React from "react"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Calendar, MapPin, Mail, User, Loader2, AlertCircle, DollarSign} from "lucide-react"
import Link from "next/link"
import {useParams, useRouter} from "next/navigation"
import {useEvent} from "@/hooks/use-events"
import {usePurchaseTicket} from "@/hooks/use-tickets"
import Image from "next/image"


export default function BuyTicketPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const {id}: { id: string, } = useParams()

    // Fetch event data from database
    const { 
        data: event, 
        isLoading: festivalLoading, 
        error: festivalError 
    } = useEvent(id)

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

    if (festivalLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading event details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (festivalError || !event) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {festivalError?.message === 'Event not found' ? 'Event Not Found' : 'Unable to Load Event'}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {festivalError?.message === 'Event not found' 
                                ? 'The event you\'re looking for doesn\'t exist or has been removed.'
                                : 'We\'re having trouble loading this event. Please try again.'
                            }
                        </p>
                        <div className="space-x-4">
                            <Link href="/events">
                                <Button>
                                    Browse Events
                                </Button>
                            </Link>
                            {festivalError?.message !== 'Event not found' && (
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

    // Check if tickets are available
    if (event.availableTickets === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tickets Sold Out</h1>
                        <p className="text-gray-600 mb-6">
                            Unfortunately, all tickets for {event.name} have been sold out.
                        </p>
                        <div className="space-x-4">
                            <Link href={`/events/${event.id}`}>
                                <Button variant="outline">
                                    Back to Event
                                </Button>
                            </Link>
                            <Link href="/events">
                                <Button>
                                    Browse Other Events
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // Real ticket purchase mutation
    const purchaseTicketMutation = usePurchaseTicket()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.email !== formData.confirmEmail) {
            alert("Email addresses don't match!")
            return
        }

        setIsLoading(true)

        try {
            const result = await purchaseTicketMutation.mutateAsync({
                eventId: event.id,
                buyerName: `${formData.firstName} ${formData.lastName}`,
                buyerEmail: formData.email,
                buyerPhone: undefined // Could add phone field later
            })

            // Redirect to ticket page with real ticket ID
            router.push(`/ticket/${result.ticket.ticketId}`)

        } catch (error) {
            console.error('Purchase error:', error)
            alert(error instanceof Error ? error.message : 'Failed to purchase ticket. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.confirmEmail &&
        formData.email === formData.confirmEmail

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6 scroll-fade-right">
                    <Link href={`/events/${event.id}`}>
                        <Button variant="outline" className="hover-glow">← Back to Event</Button>
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 ">Complete Your Purchase</h1>
                        <p className="text-gray-600 scroll-fade-up scroll-delay-200">You're just one step away from your event ticket!</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Purchase Form */}
                        <div className="lg:col-span-2">
                            <Card className="scroll-fade-left scroll-delay-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5"/>
                                        Ticket Holder Information
                                    </CardTitle>
                                    <CardDescription>Please provide the details for the person attending the
                                        event</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstName">First Name *</Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Enter first name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Last Name *</Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Enter last name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter email address"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Your ticket will be sent to this
                                                email address</p>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmEmail">Confirm Email Address *</Label>
                                            <Input
                                                id="confirmEmail"
                                                name="confirmEmail"
                                                type="email"
                                                value={formData.confirmEmail}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Confirm email address"
                                            />
                                        </div>

                                        <Separator/>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-yellow-800 mb-2">Important
                                                Information</h4>
                                            <ul className="text-sm text-yellow-700 space-y-1">
                                                <li>• Tickets are non-refundable and non-transferable</li>
                                                <li>• A valid ID matching the ticket holder name is required at entry
                                                </li>
                                                <li>• QR code ticket will be sent to your email within 5 minutes</li>
                                                <li>• Please arrive 30 minutes before the event starts</li>
                                            </ul>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-purple-600 hover:bg-purple-700 hover-glow animate-pulse-slow"
                                            size="lg"
                                            disabled={!isFormValid || isLoading || purchaseTicketMutation.isPending}
                                        >
                                            {isLoading ? "Processing..." : `Complete Purchase - ${formatPrice(event.price, event.isFree)}`}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-8 scroll-fade-right scroll-delay-400">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{event.name}</h3>
                                        <div className="text-sm text-gray-600 space-y-2 mt-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4"/>
                                                <span>{formatDate(event.startDate)}</span>
                                                {event.startDate !== event.endDate && (
                                                    <span> - {formatDate(event.endDate)}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4"/>
                                                <span>{event.venueName}, {event.city}, {event.state}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-green-600"/>
                                                <span className="font-semibold text-green-600">
                                                    {formatPrice(event.price, event.isFree)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Event Image */}
                                        <div className="relative h-32 w-full mt-4 rounded-lg overflow-hidden">
                                            <Image
                                                src={event.images[0] || "/placeholder.svg?height=200&width=300"}
                                                alt={event.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    <Separator/>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Ticket Price</span>
                                            <span>{formatPrice(event.price, event.isFree)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Service Fee</span>
                                            <span>$0</span>
                                        </div>
                                        <Separator/>
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span className="text-purple-600">{formatPrice(event.price, event.isFree)}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3"/>
                                            <span>Ticket sent via email</span>
                                        </div>
                                        <p>Secure checkout powered by our platform</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
