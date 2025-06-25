'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {useEffect} from "react";


// Mock data - replace with actual data fetching
const featuredFestivals = [
  {
    id: 1,
    title: "Summer Music Fest 2024",
    date: "2024-07-15",
    location: "Central Park, NYC",
    price: 89,
    image: "/placeholder.svg?height=200&width=300",
    category: "Music",
  },
  {
    id: 2,
    title: "Food & Wine Festival",
    date: "2024-08-20",
    location: "Napa Valley, CA",
    price: 125,
    image: "/placeholder.svg?height=200&width=300",
    category: "Food",
  },
  {
    id: 3,
    title: "Cultural Heritage Day",
    date: "2024-09-10",
    location: "Downtown Plaza",
    price: 45,
    image: "/placeholder.svg?height=200&width=300",
    category: "Culture",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "Amazing experience! The QR code tickets made entry so smooth.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    text: "Found the perfect festival for my family. Great platform!",
    rating: 5,
  },
  {
    name: "Emma Davis",
    text: "Easy booking process and excellent customer service.",
    rating: 4,
  },
]

export default function HomePage() {

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/test')
        const data = await res.json()
        console.log(data,'dataaaa')
      } catch (err) {
        console.error('Failed to fetch users:', err)
      } finally {
      }
    }

    fetchUsers()
  }, [])

  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Amazing Festivals</h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Find and book tickets for the best festivals around you. From music to food, culture to art - we've got it
                all!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/festivals">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                    Browse Festivals
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                      size="lg"
                      variant="outline"
                      className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Festivals */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Festivals</h2>
              <p className="text-gray-600 text-lg">Don't miss these upcoming amazing events</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredFestivals.map((festival) => (
                  <Card key={festival.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                          src={festival.image || "/placeholder.svg"}
                          alt={festival.title}
                          fill
                          className="object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-purple-600">{festival.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{festival.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
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

            <div className="text-center mt-12">
              <Link href="/festivals">
                <Button size="lg" variant="outline">
                  View All Festivals
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Festivals Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-gray-600">Tickets Sold</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-600 text-lg">Join thousands of happy festival-goers</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${
                                    i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                            />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                      <p className="font-semibold">- {testimonial.name}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">Get notified about new festivals and exclusive offers</p>
            <div className="max-w-md mx-auto">
              <form className="flex gap-4">
                <Input type="email" placeholder="Enter your email" className="flex-1 bg-white text-gray-900" />
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
  )
}
