"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data - replace with actual data fetching
const allFestivals = [
    {
        id: 1,
        title: "Summer Music Fest 2024",
        date: "2024-07-15",
        location: "Central Park, NYC",
        price: 89,
        image: "/placeholder.svg?height=200&width=300",
        category: "Music",
        description: "The biggest summer music festival featuring top artists from around the world.",
    },
    {
        id: 2,
        title: "Food & Wine Festival",
        date: "2024-08-20",
        location: "Napa Valley, CA",
        price: 125,
        image: "/placeholder.svg?height=200&width=300",
        category: "Food",
        description: "Taste the finest wines and gourmet food from renowned chefs.",
    },
    {
        id: 3,
        title: "Cultural Heritage Day",
        date: "2024-09-10",
        location: "Downtown Plaza",
        price: 45,
        image: "/placeholder.svg?height=200&width=300",
        category: "Culture",
        description: "Celebrate diverse cultures with traditional performances and exhibitions.",
    },
    {
        id: 4,
        title: "Art & Craft Fair",
        date: "2024-07-25",
        location: "Riverside Park",
        price: 25,
        image: "/placeholder.svg?height=200&width=300",
        category: "Art",
        description: "Discover unique handmade crafts and artwork from local artists.",
    },
    {
        id: 5,
        title: "Jazz in the Park",
        date: "2024-08-05",
        location: "City Park Amphitheater",
        price: 65,
        image: "/placeholder.svg?height=200&width=300",
        category: "Music",
        description: "An evening of smooth jazz under the stars with renowned musicians.",
    },
    {
        id: 6,
        title: "Tech Innovation Summit",
        date: "2024-09-15",
        location: "Convention Center",
        price: 199,
        image: "/placeholder.svg?height=200&width=300",
        category: "Technology",
        description: "Explore the latest in technology and innovation with industry leaders.",
    },
]

const categories = ["All", "Music", "Food", "Culture", "Art", "Technology"]

export default function FestivalsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [priceRange, setPriceRange] = useState("All")

    const filteredFestivals = allFestivals.filter((festival) => {
        const matchesSearch =
            festival.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            festival.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "All" || festival.category === selectedCategory
        const matchesPrice =
            priceRange === "All" ||
            (priceRange === "0-50" && festival.price <= 50) ||
            (priceRange === "51-100" && festival.price > 50 && festival.price <= 100) ||
            (priceRange === "100+" && festival.price > 100)

        return matchesSearch && matchesCategory && matchesPrice
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">All Festivals</h1>
                    <p className="text-gray-600 text-lg">Discover amazing events happening near you</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search festivals or locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={priceRange} onValueChange={setPriceRange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Prices</SelectItem>
                                <SelectItem value="0-50">$0 - $50</SelectItem>
                                <SelectItem value="51-100">$51 - $100</SelectItem>
                                <SelectItem value="100+">$100+</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("")
                                setSelectedCategory("All")
                                setPriceRange("All")
                            }}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredFestivals.length} of {allFestivals.length} festivals
                    </p>
                </div>

                {/* Festival Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredFestivals.map((festival) => (
                        <Card key={festival.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image src={festival.image || "/placeholder.svg"} alt={festival.title} fill className="object-cover" />
                                <Badge className="absolute top-4 left-4 bg-purple-600">{festival.category}</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl">{festival.title}</CardTitle>
                                <CardDescription className="flex flex-col gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                      {new Date(festival.date).toLocaleDateString()}
                  </span>
                                    <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                                        {festival.location}
                  </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{festival.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-purple-600">${festival.price}</span>
                                    <Link href={`/festivals/${festival.id}`}>
                                        <Button>View Details</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredFestivals.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No festivals found matching your criteria.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm("")
                                setSelectedCategory("All")
                                setPriceRange("All")
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
