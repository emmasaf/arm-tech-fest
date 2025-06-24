"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react"

const contactCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "ticket", label: "Ticket Support" },
    { value: "festival", label: "Festival Organizer" },
    { value: "technical", label: "Technical Issue" },
    { value: "partnership", label: "Partnership" },
    { value: "press", label: "Press & Media" },
]

const faqItems = [
    {
        question: "How do I receive my ticket?",
        answer: "Tickets are sent instantly to your email as QR codes after purchase confirmation.",
    },
    {
        question: "Can I get a refund?",
        answer: "Tickets are generally non-refundable, but we handle refunds on a case-by-case basis for cancelled events.",
    },
    {
        question: "What if I lose my ticket?",
        answer: "Contact us with your purchase details and we can resend your ticket to your email.",
    },
    {
        question: "How do I become a festival organizer?",
        answer:
            "Email us at partnerships@festivalhub.com with your event details and we'll get back to you within 24 hours.",
    },
]

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            category: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus("idle")

        // Simulate form submission
        setTimeout(() => {
            setSubmitStatus("success")
            setFormData({
                name: "",
                email: "",
                subject: "",
                category: "",
                message: "",
            })
            setIsSubmitting(false)
        }, 2000)
    }

    const isFormValid = formData.name && formData.email && formData.subject && formData.category && formData.message

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Have questions about festivals, tickets, or our platform? We're here to help! Reach out to us and we'll get
                        back to you as soon as possible.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription>Fill out the form below and we'll respond within 24 hours</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {submitStatus === "success" && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-800">Message sent successfully!</p>
                                            <p className="text-sm text-green-600">We'll get back to you within 24 hours.</p>
                                        </div>
                                    </div>
                                )}

                                {submitStatus === "error" && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                        <div>
                                            <p className="font-medium text-red-800">Failed to send message</p>
                                            <p className="text-sm text-red-600">Please try again or contact us directly.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter your full name"
                                            />
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
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={formData.category} onValueChange={handleSelectChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select inquiry type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {contactCategories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Brief description of your inquiry"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Please provide details about your inquiry..."
                                            rows={6}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-purple-600 hover:bg-purple-700"
                                        size="lg"
                                        disabled={!isFormValid || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information & FAQ */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Multiple ways to reach our team</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-sm text-gray-600">support@festivalhub.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p className="text-sm text-gray-600">
                                            123 Festival Street
                                            <br />
                                            New York, NY 10001
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Business Hours</p>
                                        <p className="text-sm text-gray-600">
                                            Mon-Fri: 9AM-6PM EST
                                            <br />
                                            Weekends: 10AM-4PM EST
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Help */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Help</CardTitle>
                                <CardDescription>Common inquiries and solutions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">Urgent</Badge>
                                        <h4 className="font-medium">Ticket Issues</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Problems with your ticket or QR code? Email us immediately with your ticket ID.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-purple-600">Partnership</Badge>
                                        <h4 className="font-medium">Festival Organizers</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Want to list your festival? Contact our partnerships team for quick onboarding.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">General</Badge>
                                        <h4 className="font-medium">Technical Support</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Website issues or bugs? Our tech team responds within 2 hours during business hours.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {faqItems.map((faq, index) => (
                                    <div key={index}>
                                        <h4 className="font-medium mb-2 text-sm">{faq.question}</h4>
                                        <p className="text-xs text-gray-600 mb-3">{faq.answer}</p>
                                        {index < faqItems.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="max-w-4xl mx-auto mt-12">
                    <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-orange-800 mb-2">Emergency Support</h3>
                                    <p className="text-orange-700 text-sm mb-3">
                                        If you're experiencing issues on the day of an event or need immediate assistance:
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call: +1 (555) 911-FEST
                                        </Button>
                                        <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                                            <Mail className="h-4 w-4 mr-2" />
                                            urgent@festivalhub.com
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
