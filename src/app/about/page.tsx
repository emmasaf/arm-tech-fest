import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Shield, Zap, Award, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
    {
        icon: Heart,
        title: "Passion for Festivals",
        description: "We're festival enthusiasts who understand what makes events special and memorable.",
    },
    {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Your tickets are safe with us. We use industry-standard security measures.",
    },
    {
        icon: Zap,
        title: "Instant Delivery",
        description: "Get your QR code tickets instantly via email. No waiting, no hassle.",
    },
    {
        icon: Users,
        title: "Community Focused",
        description: "We bring people together through amazing festival experiences.",
    },
]

const stats = [
    { number: "50+", label: "Festivals Listed" },
    { number: "10K+", label: "Happy Customers" },
    { number: "25+", label: "Cities Covered" },
    { number: "4.8★", label: "Average Rating" },
]

const team = [
    {
        name: "Sarah Johnson",
        role: "Founder & CEO",
        image: "/placeholder.svg?height=200&width=200",
        description: "Festival enthusiast with 10+ years in event management.",
    },
    {
        name: "Mike Chen",
        role: "CTO",
        image: "/placeholder.svg?height=200&width=200",
        description: "Tech expert passionate about creating seamless user experiences.",
    },
    {
        name: "Emma Davis",
        role: "Head of Partnerships",
        image: "/placeholder.svg?height=200&width=200",
        description: "Connects amazing festivals with festival-goers worldwide.",
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">About FestivalHub</h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                        We're on a mission to connect festival lovers with incredible experiences around the world.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            At FestivalHub, we believe that festivals are more than just events – they're experiences that bring
                            people together, create lasting memories, and celebrate the diversity of human culture. Our platform makes
                            it easy for festival organizers to reach their audience and for festival-goers to discover their next
                            adventure.
                        </p>
                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-purple-600">For Festival Lovers</h3>
                                <p className="text-gray-600">
                                    Discover amazing festivals, get instant tickets, and never miss out on the experiences you love. Our
                                    platform makes finding and attending festivals simple and secure.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-purple-600">For Organizers</h3>
                                <p className="text-gray-600">
                                    Reach more attendees, manage ticket sales efficiently, and focus on creating amazing experiences. We
                                    handle the technology so you can focus on your event.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FestivalHub?</h2>
                        <p className="text-gray-600 text-lg">We're committed to making your festival experience amazing</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
                        <p className="text-gray-600 text-lg">Numbers that show our commitment to the festival community</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
                        <p className="text-gray-600 text-lg">The passionate people behind FestivalHub</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {team.map((member, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                                        <Image
                                            src={member.image || "/placeholder.svg"}
                                            alt={member.name}
                                            width={96}
                                            height={96}
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardTitle>{member.name}</CardTitle>
                                    <CardDescription>
                                        <Badge variant="secondary">{member.role}</Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm">{member.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
                            <p className="text-gray-600 text-lg">The principles that guide everything we do</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Globe className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
                                    <p className="text-gray-600">
                                        We believe festivals should be accessible to everyone, regardless of background or circumstances.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Award className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                                    <p className="text-gray-600">
                                        We strive for excellence in everything we do, from our platform to our customer service.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Heart className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Community</h3>
                                    <p className="text-gray-600">
                                        We're building a community of festival lovers who share experiences and create connections.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Trust</h3>
                                    <p className="text-gray-600">
                                        We earn trust through transparency, security, and consistently delivering on our promises.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Next Festival?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of festival-goers who trust FestivalHub for their event experiences
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/festivals">
                            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                                Browse Festivals
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-purple-600"
                            >
                                Get in Touch
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
