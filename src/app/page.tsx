'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Star, Search, ArrowRight, Loader2, AlertCircle, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useFeaturedEvents } from "@/hooks/use-events"

// Static testimonials (could be moved to database if needed)
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    text: "Amazing experience! The QR code tickets made entry so smooth.",
    rating: 5,
    location: "Los Angeles, CA"
  },
  {
    id: 2,
    name: "Michael Chen",
    text: "Great variety of events and easy booking process.",
    rating: 5,
    location: "San Francisco, CA"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    text: "Love how organized everything is. Found my perfect event!",
    rating: 5,
    location: "Austin, TX"
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Fetch featured events from database
  const { 
    data: featuredData, 
    isLoading: featuredLoading, 
    error: featuredError 
  } = useFeaturedEvents(6)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`
    }
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Amazing</span> Events
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 animate-fade-in-up scroll-delay-200">
            From music and food to culture and art, find the perfect event experience for you
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 animate-fade-in-up scroll-delay-400">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-gray-900"
              />
              <Button type="submit" className="ml-2 hover-glow">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up scroll-delay-600">
            <Link href="/events">
              <Button size="lg" className="hover-glow">
                Browse All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register-event">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                List Your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these amazing upcoming events
            </p>
          </div>

          {/* Loading State */}
          {featuredLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading featured events...</p>
            </div>
          )}

          {/* Error State */}
          {featuredError && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Events</h3>
              <p className="text-gray-600 mb-4">We're having trouble loading the featured events.</p>
              <Link href="/events">
                <Button variant="outline">
                  View All Events
                </Button>
              </Link>
            </div>
          )}

          {/* Featured Events Grid */}
          {!featuredLoading && !featuredError && featuredData && (
            <>
              {featuredData.events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Events</h3>
                  <p className="text-gray-600 mb-4">Check back soon for exciting upcoming events!</p>
                  <Link href="/events">
                    <Button variant="outline">
                      Browse All Events
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {featuredData.events.map((event, index) => (
                    <Card key={event.id} className="overflow-hidden hover-lift transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
                            style={{ backgroundColor: event.category.color }}
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
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {event.venueName}, {event.city}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                              <span className="font-semibold text-green-600">
                                {formatPrice(event.price, event.isFree)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
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

              {/* View More Button */}
              {featuredData.events.length > 0 && (
                <div className="text-center">
                  <Link href="/events">
                    <Button variant="outline" size="lg">
                      View All Events
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">5+</div>
              <div className="text-gray-600">Active Events</div>
            </div>
            <div className="animate-fade-in-up scroll-delay-100">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">156+</div>
              <div className="text-gray-600">Tickets Sold</div>
            </div>
            <div className="animate-fade-in-up scroll-delay-200">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">8+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="animate-fade-in-up scroll-delay-300">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">6</div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What People Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from event-goers themselves
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="animate-fade-in-up hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-fade-in-up">
            Ready to Start Your Event Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up scroll-delay-200">
            Browse our curated selection of events and find your next unforgettable experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up scroll-delay-400">
            <Link href="/events">
              <Button size="lg" variant="secondary" className="hover-glow">
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register-event">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                List Your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}