import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Clock, Users, Share2, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

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
        images: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
        ],
        category: "Music",
        description:
            "The biggest summer music festival featuring top artists from around the world. Experience an unforgettable day of music, food, and fun in the heart of New York City.",
        longDescription: `Join us for the most anticipated music festival of the summer! Summer Music Fest 2024 brings together world-renowned artists, emerging talents, and music lovers from all walks of life.

    What to expect:
    • 3 different stages with continuous performances
    • Food trucks and local vendors
    • Art installations and interactive experiences
    • VIP areas with premium amenities
    • Free water stations throughout the venue

    This year's lineup includes headliners from various genres including pop, rock, indie, and electronic music. Don't miss this incredible opportunity to discover new artists and enjoy your favorites in a beautiful outdoor setting.`,
        capacity: 5000,
        organizer: "NYC Music Events",
        tags: ["Outdoor", "All Ages", "Food & Drinks", "Parking Available"],
    },
]

interface PageProps {
    params: {
        id: string
    }
}

export default function FestivalDetailsPage({ params }: PageProps) {
    const festival = festivals.find((f) => f.id === Number.parseInt(params.id))

    if (!festival) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/festivals">
                        <Button variant="outline">← Back to Festivals</Button>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="mb-8">
                            <div className="relative h-96 rounded-lg overflow-hidden">
                                <Image
                                    src={festival.images[0] || "/placeholder.svg"}
                                    alt={festival.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {festival.images.length > 1 && (
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {festival.images.slice(1).map((image, index) => (
                                        <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                                            <Image
                                                src={image || "/placeholder.svg"}
                                                alt={`${festival.title} ${index + 2}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Festival Info */}
                        <div className="bg-white rounded-lg p-6 mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{festival.title}</h1>
                                    <Badge className="bg-purple-600">{festival.category}</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
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
                                    <Clock className="h-5 w-5 text-purple-600" />
                                    <span>{festival.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-purple-600" />
                                    <span>{festival.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600" />
                                    <span>Up to {festival.capacity.toLocaleString()} attendees</span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div>
                                <h2 className="text-xl font-semibold mb-4">About This Festival</h2>
                                <p className="text-gray-600 mb-4">{festival.description}</p>
                                <div className="whitespace-pre-line text-gray-600">{festival.longDescription}</div>
                            </div>

                            <Separator className="my-6" />

                            <div>
                                <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                                <div className="flex flex-wrap gap-2">
                                    {festival.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Location</h3>
                            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Interactive Map Coming Soon</p>
                            </div>
                            <p className="text-gray-600 mt-2">{festival.address}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-2xl text-purple-600">${festival.price}</CardTitle>
                                <CardDescription>per ticket</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Link href={`/buy-ticket/${festival.id}`} className="w-full">
                                    <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                                        Buy Ticket Now
                                    </Button>
                                </Link>

                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Organizer:</span>
                                        <span className="font-medium">{festival.organizer}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Category:</span>
                                        <span className="font-medium">{festival.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Capacity:</span>
                                        <span className="font-medium">{festival.capacity.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="text-xs text-gray-500">
                                    <p>• Tickets are non-refundable</p>
                                    <p>• QR code will be sent via email</p>
                                    <p>• Valid ID required at entry</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
