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
import {useTranslations} from "@/contexts/translation-context"

export default function FestivalsPage() {
    const t = useTranslations()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'finished'>("all")

    // Fetch events with filters
    const {
        data: festivalsData,
        isLoading: festivalsLoading,
        error: festivalsError,
        refetch: refetchFestivals
    } = useEvents({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        status: statusFilter,
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
        if (isFree) return t('common.free')
        return `$${price.toFixed(2)}`
    }

    const getEventStatus = (startDate: string, endDate: string) => {
        const now = new Date()
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (now < start) return "upcoming"
        if (now >= start && now <= end) return "ongoing"
        return "finished"
    }


    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "ongoing":
                return "bg-green-500 text-white"
            case "upcoming":
                return "bg-blue-500 text-white"
            case "finished":
                return "bg-gray-500 text-white"
            default:
                return ""
        }
    }


    if (festivalsError) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('events.failedToLoad')}</h2>
                        <p className="text-gray-600 mb-4">{t('events.failedToLoadMessage')}</p>
                        <Button onClick={() => refetchFestivals()} variant="outline">
                            {t('common.retry')}
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
                        {t('events.title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('events.subtitle')}
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {/* Search Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('events.searchEvents')}
                            </label>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                                <Input
                                    type="text"
                                    placeholder={t('events.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('events.category')}
                            </label>
                            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('events.allCategories')}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('events.allCategories')}</SelectItem>
                                    {categoriesLoading ? (
                                        <SelectItem value="loading" disabled>{t('common.loading')}</SelectItem>
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
                                {t('common.search')}
                            </Button>
                        </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">{t('events.filters.statusLabel')}</label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={statusFilter === "all" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter("all")}
                                    >
                                        {t('events.statusAll')}
                                    </Button>
                                    <Button
                                        variant={statusFilter === "ongoing" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter("ongoing")}
                                        className={statusFilter === "ongoing" ? "bg-green-500 hover:bg-green-600" : ""}
                                    >
                                        {t('events.statusOngoing')}
                                    </Button>
                                    <Button
                                        variant={statusFilter === "upcoming" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter("upcoming")}
                                        className={statusFilter === "upcoming" ? "bg-blue-500 hover:bg-blue-600" : ""}
                                    >
                                        {t('events.statusUpcoming')}
                                    </Button>
                                    <Button
                                        variant={statusFilter === "finished" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter("finished")}
                                        className={statusFilter === "finished" ? "bg-gray-500 hover:bg-gray-600" : ""}
                                    >
                                        {t('events.statusFinished')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            {t('events.showingEvents', { 
                                shown: (festivalsData?.events.length || 0).toString(), 
                                total: (festivalsData?.pagination.total || 0).toString() 
                            })}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {festivalsLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4"/>
                        <p className="text-gray-600">{t('common.loadingEvents')}</p>
                    </div>
                )}

                {/* Events Grid */}
                {!festivalsLoading && festivalsData && (
                    <>
                        {festivalsData?.events.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('events.noEventsFound')}</h3>
                                <p className="text-gray-600">{t('events.noEventsMessage')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                {festivalsData.events.map((event) => {
                                    const eventStatus = getEventStatus(event.startDate, event.endDate)
                                    return (
                                        <Card key={event.id}
                                              className="overflow-hidden hover-lift transition-all duration-300 hover:shadow-lg">
                                            <div className="relative h-48 overflow-hidden">
                                                <Image
                                                    src={event?.images?.[0] || "/placeholder.svg?height=200&width=300"}
                                                    alt={event.name}
                                                    fill
                                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                                <div className="absolute top-4 left-4 right-4 flex justify-between">
                                                    <Badge
                                                        variant="secondary"
                                                        className={getStatusBadgeClass(eventStatus)}
                                                    >
                                                        {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
                                                    </Badge>
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
                                                            <span>{event.availableTickets} {t('common.left')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="pt-3">
                                                        <Link href={`/events/${event.id}`}>
                                                            <Button className="w-full hover-glow">
                                                                {t('events.viewDetails')}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
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
                                    {t('common.previous')}
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
                                    {t('common.next')}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}