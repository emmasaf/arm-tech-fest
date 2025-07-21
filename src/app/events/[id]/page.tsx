'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Clock, Users, Share2, Heart, DollarSign, Loader2, AlertCircle, ExternalLink, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEvent } from "@/hooks/use-events"
import { useState } from "react"

export default function FestivalDetailsPage() {
    const { id }: { id: string } = useParams()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Fetch event data from database
    const { 
        data: event, 
        isLoading, 
        error 
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

    const handleShare = async () => {
        if (navigator.share && event) {
            try {
                await navigator.share({
                    title: event.name,
                    text: event.description,
                    url: window.location.href,
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback to copying URL to clipboard
            navigator.clipboard.writeText(window.location.href)
            // You could show a toast notification here
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading event details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {error?.message === 'Event not found' ? 'Event Not Found' : 'Unable to Load Event'}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {error?.message === 'Event not found' 
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
                            {error?.message !== 'Event not found' && (
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/events">
                        <Button variant="outline" className="mb-4">
                            ← Back to Events
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hero Image Gallery */}
                        <div className="relative mb-8">
                            <div className="relative h-96 rounded-lg overflow-hidden">
                                <Image
                                    src={event.images[currentImageIndex] || "/placeholder.svg?height=400&width=600"}
                                    alt={event.name}
                                    fill
                                    className="object-cover"
                                />
                                
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <Badge 
                                        className="text-white font-semibold"
                                        style={{ backgroundColor: event.category.color }}
                                    >
                                        {event.category.icon} {event.category.name}
                                    </Badge>
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <Button 
                                        variant="secondary" 
                                        size="icon"
                                        onClick={handleShare}
                                        className="bg-white/90 hover:bg-white"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        size="icon"
                                        className="bg-white/90 hover:bg-white"
                                    >
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Image Thumbnails */}
                            {event.images.length > 1 && (
                                <div className="flex space-x-2 mt-4 overflow-x-auto">
                                    {event.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                                                index === currentImageIndex ? 'ring-2 ring-purple-500' : ''
                                            }`}
                                        >
                                            <Image
                                                src={image || "/placeholder.svg?height=80&width=80"}
                                                alt={`${event.name} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Event Info */}
                        <Card className="mb-8">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-3xl mb-2">{event.name}</CardTitle>
                                        <CardDescription className="text-lg">
                                            {event.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-5 w-5 mr-3 flex-shrink-0" />
                                            <div>
                                                <div className="font-medium">Date</div>
                                                <div>{formatDate(event.startDate)} 
                                                    {event.startDate !== event.endDate && (
                                                        <span> - {formatDate(event.endDate)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
                                            <div>
                                                <div className="font-medium">Time</div>
                                                <div>{formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                                            <div>
                                                <div className="font-medium">Venue</div>
                                                <div>{event.venueName}</div>
                                                <div className="text-sm">{event.venueAddress}, {event.city}, {event.state}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-5 w-5 mr-3 flex-shrink-0" />
                                            <div>
                                                <div className="font-medium">Capacity</div>
                                                <div>{event.capacity.toLocaleString()} people</div>
                                                <div className="text-sm text-green-600">{event.availableTickets} tickets available</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Features */}
                                <div>
                                    <h3 className="font-semibold mb-3">Event Features</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {event.venueType && (
                                            <Badge variant="outline">{event.venueType} Venue</Badge>
                                        )}
                                        {event.ageRestriction && (
                                            <Badge variant="outline">{event.ageRestriction}</Badge>
                                        )}
                                        {event.isAccessible && (
                                            <Badge variant="outline">Wheelchair Accessible</Badge>
                                        )}
                                        {event.hasParking && (
                                            <Badge variant="outline">Parking Available</Badge>
                                        )}
                                        {event.hasFoodVendors && (
                                            <Badge variant="outline">Food & Drinks</Badge>
                                        )}
                                        {event.servesAlcohol && (
                                            <Badge variant="outline">Alcohol Served</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organizer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Organizer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <div className="font-semibold">{event.organizer.name}</div>
                                        {event.organizer.organization && (
                                            <div className="text-gray-600">{event.organizer.organization}</div>
                                        )}
                                    </div>
                                    
                                    {/* Additional organizer links could be added here */}
                                    {event.websiteUrl && (
                                        <div className="flex items-center">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            <a 
                                                href={event.websiteUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:underline"
                                            >
                                                Event Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Ticket Purchase Card */}
                        <Card className="sticky top-8 mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Get Tickets</span>
                                    <div className="flex items-center text-green-600">
                                        <DollarSign className="h-5 w-5 mr-1" />
                                        <span className="text-2xl font-bold">
                                            {formatPrice(event.price, event.isFree)}
                                        </span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Tickets Available:</span>
                                        <span className="font-semibold text-green-600">
                                            {event.availableTickets}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Capacity:</span>
                                        <span>{event.capacity.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Link href={`/buy-ticket/${event.id}`}>
                                        <Button 
                                            className="w-full hover-glow" 
                                            size="lg"
                                            disabled={event.availableTickets === 0}
                                        >
                                            {event.availableTickets === 0 ? 'Sold Out' : 'Buy Tickets'}
                                        </Button>
                                    </Link>
                                    
                                    {event.availableTickets > 0 && event.availableTickets < 50 && (
                                        <p className="text-sm text-orange-600 text-center">
                                            Only {event.availableTickets} tickets left!
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Event Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <span className="font-medium">Duration:</span>
                                    <span className="ml-2">
                                        {event.startDate === event.endDate 
                                            ? 'Single Day Event'
                                            : `${Math.ceil((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days`
                                        }
                                    </span>
                                </div>
                                
                                <div>
                                    <span className="font-medium">Expected Attendance:</span>
                                    <span className="ml-2">{event.expectedAttendance}</span>
                                </div>
                                
                                {event.currency !== 'USD' && (
                                    <div>
                                        <span className="font-medium">Currency:</span>
                                        <span className="ml-2">{event.currency}</span>
                                    </div>
                                )}
                                
                                <div>
                                    <span className="font-medium">Listed:</span>
                                    <span className="ml-2">
                                        {event.publishedAt ? formatDate(event.publishedAt) : 'Recently'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}