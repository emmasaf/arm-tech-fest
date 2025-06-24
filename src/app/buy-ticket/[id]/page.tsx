"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Mail, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock data - replace with actual data fetching
const festivals = [
    {
        id: 1,
        title: "Summer Music Fest 2024",
        date: "2024-07-15",
        location: "Central Park, NYC",
        price: 89,
        image: "/placeholder.svg?height=200&width=300",
    },
]

interface PageProps {
    params: {
        id: string
    }
}

export default function BuyTicketPage({ params }: PageProps) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const festival = festivals.find((f) => f.id === Number.parseInt(params.id))

    if (!festival) {
        return <div>Festival not found</div>
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.email !== formData.confirmEmail) {
            alert("Email addresses don't match!")
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            // Generate a mock ticket ID
            const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase()

            // Redirect to ticket page
            router.push(
                `/ticket/${ticketId}?festivalId=${festival.id}&name=${encodeURIComponent(formData.firstName + " " + formData.lastName)}&email=${encodeURIComponent(formData.email)}`,
            )
        }, 2000)
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
                <div className="mb-6">
                    <Link href={`/festivals/${festival.id}`}>
                        <Button variant="outline">← Back to Festival</Button>
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
                        <p className="text-gray-600">You're just one step away from your festival ticket!</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Purchase Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Ticket Holder Information
                                    </CardTitle>
                                    <CardDescription>Please provide the details for the person attending the festival</CardDescription>
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
                                            <p className="text-sm text-gray-500 mt-1">Your ticket will be sent to this email address</p>
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

                                        <Separator />

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                                            <ul className="text-sm text-yellow-700 space-y-1">
                                                <li>• Tickets are non-refundable and non-transferable</li>
                                                <li>• A valid ID matching the ticket holder name is required at entry</li>
                                                <li>• QR code ticket will be sent to your email within 5 minutes</li>
                                                <li>• Please arrive 30 minutes before the event starts</li>
                                            </ul>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-purple-600 hover:bg-purple-700"
                                            size="lg"
                                            disabled={!isFormValid || isLoading}
                                        >
                                            {isLoading ? "Processing..." : `Complete Purchase - $${festival.price}`}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-8">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{festival.title}</h3>
                                        <div className="text-sm text-gray-600 space-y-1 mt-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(festival.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{festival.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Ticket Price</span>
                                            <span>${festival.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Service Fee</span>
                                            <span>$0</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span className="text-purple-600">${festival.price}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
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
