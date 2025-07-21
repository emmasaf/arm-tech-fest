"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Calendar, MapPin, Search, Filter, Loader2, AlertCircle, DollarSign, Users} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {useEvents} from "@/hooks/use-events"
import {useCategories} from "@/hooks/use-categories"

export default function FestivalsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)

    // Fetch events with filters
    const {
        data: festivalsData,
        isLoading: festivalsLoading,
        error: festivalsError,
        refetch: refetchFestivals
    } = useEvents({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        upcoming: showUpcomingOnly,
        page: currentPage,
        limit: 12
    })

    // Fetch categories for filter dropdown
    const {data: categories, isLoading: categoriesLoading} = useCategories()

    const handleSearch = async () => {
        setCurrentPage(1) // Reset to first page when searching
        await refetchFestivals()
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category === "all" ? "" : category)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Scroll to top when page changes
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatPrice = (price: number, isFree: boolean) => {
        if (isFree) return "Free"
        return `$${price.toFixed(2)}`
    }

    if (festivalsError) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Events</h2>
                        <p className="text-gray-600 mb-4">We're having trouble loading the events. Please try
                            again.</p>
                        <Button onClick={() => refetchFestivals()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Discover Amazing Events
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From music and food to culture and art, find the perfect event experience for you
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {/* Search Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Events
                            </label>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                                <Input
                                    type="text"
                                    placeholder="Search by name, location, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categoriesLoading ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : (
                                        categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.slug}>
                                                {category.icon} {category.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <div>
                            <Button
                                onClick={handleSearch}
                                className="w-full hover-glow"
                                disabled={festivalsLoading}
                            >
                                {festivalsLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                ) : (
                                    <Search className="h-4 w-4 mr-2"/>
                                )}
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="upcoming"
                                checked={showUpcomingOnly}
                                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="upcoming" className="text-sm text-gray-700">
                                Show upcoming events only
                            </label>
                        </div>
                        <div className="text-sm text-gray-500">
                            {festivalsData?.pagination.total || 0} events found
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {festivalsLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4"/>
                        <p className="text-gray-600">Loading events...</p>
                    </div>
                )}

                {/* Events Grid */}
                {!festivalsLoading && festivalsData && (
                    <>
                        {festivalsData.events.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                {festivalsData.events.map((event) => (
                                    <Card key={event.id}
                                          className="overflow-hidden hover-lift transition-all duration-300 hover:shadow-lg">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={event.images[0] || "/placeholder.svg?height=200&width=300"}
                                                alt={event.name}
                                                fill
                                                className="object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-white font-semibold"
                                                    style={{backgroundColor: event.category.color}}
                                                >
                                                    {event.category.icon} {event.category.name}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="line-clamp-2">{event.name}</CardTitle>
                                            <CardDescription className="line-clamp-3">
                                                {event.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0"/>
                                                    <span>{formatDate(event.startDate)}</span>
                                                    {event.startDate !== event.endDate && (
                                                        <span> - {formatDate(event.endDate)}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0"/>
                                                    <span className="line-clamp-1">
                                                        {event.venueName}, {event.city}, {event.state}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-sm">
                                                        <DollarSign className="h-4 w-4 mr-1 text-green-600"/>
                                                        <span className="font-semibold text-green-600">
                                                            {formatPrice(event.price, event.isFree)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Users className="h-4 w-4 mr-1"/>
                                                        <span>{event.availableTickets} left</span>
                                                    </div>
                                                </div>
                                                <div className="pt-3">
                                                    <Link href={`/events/${event.id}`}>
                                                        <Button className="w-full hover-glow">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {festivalsData.pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    Previous
                                </Button>

                                <div className="flex space-x-1">
                                    {Array.from({length: festivalsData.pagination.totalPages}, (_, i) => i + 1)
                                        .filter(page =>
                                            page === 1 ||
                                            page === festivalsData.pagination.totalPages ||
                                            Math.abs(page - currentPage) <= 2
                                        )
                                        .map((page, index, array) => (
                                            <div key={page} className="flex items-center">
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span className="px-2 text-gray-400">...</span>
                                                )}
                                                <Button
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    onClick={() => handlePageChange(page)}
                                                    className="w-10 h-10"
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        ))
                                    }
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= festivalsData.pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}