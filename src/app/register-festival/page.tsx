
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, MapPin, Users, DollarSign, Upload, CheckCircle, Info } from "lucide-react"

const festivalCategories = [
    { value: "music", label: "Music Festival" },
    { value: "food", label: "Food & Drink" },
    { value: "culture", label: "Cultural Event" },
    { value: "art", label: "Art & Craft" },
    { value: "technology", label: "Technology" },
    { value: "sports", label: "Sports & Recreation" },
    { value: "family", label: "Family & Kids" },
    { value: "business", label: "Business & Networking" },
    { value: "other", label: "Other" },
]

const venueTypes = [
    { value: "outdoor", label: "Outdoor Venue" },
    { value: "indoor", label: "Indoor Venue" },
    { value: "mixed", label: "Indoor & Outdoor" },
    { value: "virtual", label: "Virtual Event" },
    { value: "hybrid", label: "Hybrid (Physical + Virtual)" },
]

const expectedAttendance = [
    { value: "0-100", label: "0-100 people" },
    { value: "101-500", label: "101-500 people" },
    { value: "501-1000", label: "501-1,000 people" },
    { value: "1001-5000", label: "1,001-5,000 people" },
    { value: "5001-10000", label: "5,001-10,000 people" },
    { value: "10000+", label: "10,000+ people" },
]

interface FormData {
    // Organizer Information
    organizerName: string
    organizerEmail: string
    organizerPhone: string
    organizationName: string
    organizationWebsite: string
    organizationDescription: string

    // Festival Information
    festivalName: string
    festivalDescription: string
    category: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string

    // Location Information
    venueName: string
    venueAddress: string
    city: string
    state: string
    zipCode: string
    country: string
    venueType: string

    // Event Details
    expectedAttendance: string
    ticketPrice: string
    freeEvent: boolean
    ageRestriction: string
    accessibility: boolean
    parking: boolean
    foodVendors: boolean
    alcoholServed: boolean

    // Marketing & Media
    websiteUrl: string
    socialMediaLinks: string
    previousEvents: string
    marketingPlan: string

    // Requirements & Logistics
    specialRequirements: string
    insuranceInfo: string
    permitsObtained: boolean
    emergencyPlan: string

    // Agreement
    termsAccepted: boolean
    dataProcessingAccepted: boolean
}

export default function RegisterFestivalPage() {
    const [formData, setFormData] = useState<FormData>({
        organizerName: "",
        organizerEmail: "",
        organizerPhone: "",
        organizationName: "",
        organizationWebsite: "",
        organizationDescription: "",
        festivalName: "",
        festivalDescription: "",
        category: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        venueName: "",
        venueAddress: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        venueType: "",
        expectedAttendance: "",
        ticketPrice: "",
        freeEvent: false,
        ageRestriction: "",
        accessibility: false,
        parking: false,
        foodVendors: false,
        alcoholServed: false,
        websiteUrl: "",
        socialMediaLinks: "",
        previousEvents: "",
        marketingPlan: "",
        specialRequirements: "",
        insuranceInfo: "",
        permitsObtained: false,
        emergencyPlan: "",
        termsAccepted: false,
        dataProcessingAccepted: false,
    })

    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

    const totalSteps = 6

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }))
    }

    const handleFileUpload = (fileName: string) => {
        setUploadedFiles((prev) => [...prev, fileName])
    }

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus("idle")

        // Simulate form submission
        setTimeout(() => {
            setSubmitStatus("success")
            setIsSubmitting(false)
        }, 3000)
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.organizerName && formData.organizerEmail && formData.organizerPhone && formData.organizationName
            case 2:
                return formData.festivalName && formData.festivalDescription && formData.category
            case 3:
                return formData.startDate && formData.endDate && formData.startTime && formData.endTime
            case 4:
                return formData.venueName && formData.venueAddress && formData.city && formData.state && formData.venueType
            case 5:
                return formData.expectedAttendance && (formData.freeEvent || formData.ticketPrice)
            case 6:
                return formData.termsAccepted && formData.dataProcessingAccepted
            default:
                return true
        }
    }

    if (submitStatus === "success") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-4">
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-green-800 mb-4">Application Submitted Successfully!</h1>
                            <p className="text-green-700 mb-6">
                                Thank you for submitting your festival registration request. Our team will review your application and
                                get back to you within 3-5 business days.
                            </p>
                            <div className="bg-white rounded-lg p-4 mb-6">
                                <h3 className="font-semibold mb-2">What happens next?</h3>
                                <ul className="text-sm text-gray-600 space-y-1 text-left">
                                    <li>• Our team reviews your application</li>
                                    <li>• We may contact you for additional information</li>
                                    <li>• You'll receive approval/feedback via email</li>
                                    <li>• Once approved, we'll help you set up your festival listing</li>
                                </ul>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button onClick={() => (window.location.href = "/")}>Back to Home</Button>
                                <Button variant="outline" onClick={() => (window.location.href = "/festivals")}>
                                    Browse Festivals
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Register Your Festival</h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Join our platform and reach thousands of festival-goers. Fill out the form below to submit your festival for
                        review and approval.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {Array.from({ length: totalSteps }, (_, i) => (
                            <div key={i} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        i + 1 <= currentStep
                                            ? "bg-purple-600 text-white"
                                            : i + 1 === currentStep + 1 && isStepValid(currentStep)
                                                ? "bg-purple-200 text-purple-600"
                                                : "bg-gray-200 text-gray-500"
                                    }`}
                                >
                                    {i + 1}
                                </div>
                                {i < totalSteps - 1 && (
                                    <div className={`w-full h-1 mx-2 ${i + 1 < currentStep ? "bg-purple-600" : "bg-gray-200"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    {/* Step 1: Organizer Information */}
                    {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Organizer Information
                                </CardTitle>
                                <CardDescription>Tell us about yourself and your organization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="organizerName">Full Name *</Label>
                                        <Input
                                            id="organizerName"
                                            name="organizerName"
                                            value={formData.organizerName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="organizerEmail">Email Address *</Label>
                                        <Input
                                            id="organizerEmail"
                                            name="organizerEmail"
                                            type="email"
                                            value={formData.organizerEmail}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="organizerPhone">Phone Number *</Label>
                                        <Input
                                            id="organizerPhone"
                                            name="organizerPhone"
                                            type="tel"
                                            value={formData.organizerPhone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="organizationName">Organization Name *</Label>
                                        <Input
                                            id="organizationName"
                                            name="organizationName"
                                            value={formData.organizationName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Your company/organization"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="organizationWebsite">Organization Website</Label>
                                    <Input
                                        id="organizationWebsite"
                                        name="organizationWebsite"
                                        type="url"
                                        value={formData.organizationWebsite}
                                        onChange={handleInputChange}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="organizationDescription">Organization Description *</Label>
                                    <Textarea
                                        id="organizationDescription"
                                        name="organizationDescription"
                                        value={formData.organizationDescription}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Brief description of your organization and experience in event management..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Festival Information */}
                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Festival Information
                                </CardTitle>
                                <CardDescription>Provide details about your festival</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="festivalName">Festival Name *</Label>
                                    <Input
                                        id="festivalName"
                                        name="festivalName"
                                        value={formData.festivalName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Amazing Music Festival 2024"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="category">Festival Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select festival category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {festivalCategories.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="festivalDescription">Festival Description *</Label>
                                    <Textarea
                                        id="festivalDescription"
                                        name="festivalDescription"
                                        value={formData.festivalDescription}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Describe your festival, what makes it special, target audience, activities, performers, etc..."
                                        rows={6}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="websiteUrl">Festival Website</Label>
                                    <Input
                                        id="websiteUrl"
                                        name="websiteUrl"
                                        type="url"
                                        value={formData.websiteUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://yourfestival.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="socialMediaLinks">Social Media Links</Label>
                                    <Textarea
                                        id="socialMediaLinks"
                                        name="socialMediaLinks"
                                        value={formData.socialMediaLinks}
                                        onChange={handleInputChange}
                                        placeholder="Facebook: https://facebook.com/yourfestival&#10;Instagram: @yourfestival&#10;Twitter: @yourfestival"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Date & Time */}
                    {currentStep === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Date & Time Information
                                </CardTitle>
                                <CardDescription>When will your festival take place?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate">Start Date *</Label>
                                        <Input
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endDate">End Date *</Label>
                                        <Input
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startTime">Start Time *</Label>
                                        <Input
                                            id="startTime"
                                            name="startTime"
                                            type="time"
                                            value={formData.startTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endTime">End Time *</Label>
                                        <Input
                                            id="endTime"
                                            name="endTime"
                                            type="time"
                                            value={formData.endTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-blue-800 mb-1">Date Guidelines</h4>
                                            <ul className="text-sm text-blue-700 space-y-1">
                                                <li>• Festival must be at least 30 days from submission date</li>
                                                <li>• Multi-day festivals should include all event days</li>
                                                <li>• Consider setup and breakdown time in your planning</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Location Information */}
                    {currentStep === 4 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Location Information
                                </CardTitle>
                                <CardDescription>Where will your festival be held?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="venueName">Venue Name *</Label>
                                    <Input
                                        id="venueName"
                                        name="venueName"
                                        value={formData.venueName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Central Park, Convention Center, etc."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="venueAddress">Venue Address *</Label>
                                    <Input
                                        id="venueAddress"
                                        name="venueAddress"
                                        value={formData.venueAddress}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State/Province *</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="NY"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="United States"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="venueType">Venue Type *</Label>
                                    <Select value={formData.venueType} onValueChange={(value) => handleSelectChange("venueType", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select venue type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {venueTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label>Venue Amenities</Label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="accessibility"
                                                checked={formData.accessibility}
                                                onCheckedChange={(checked) => handleCheckboxChange("accessibility", checked as boolean)}
                                            />
                                            <Label htmlFor="accessibility" className="text-sm">
                                                Wheelchair Accessible
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="parking"
                                                checked={formData.parking}
                                                onCheckedChange={(checked) => handleCheckboxChange("parking", checked as boolean)}
                                            />
                                            <Label htmlFor="parking" className="text-sm">
                                                Parking Available
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 5: Event Details */}
                    {currentStep === 5 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Event Details & Pricing
                                </CardTitle>
                                <CardDescription>Provide details about attendance and pricing</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="expectedAttendance">Expected Attendance *</Label>
                                    <Select
                                        value={formData.expectedAttendance}
                                        onValueChange={(value) => handleSelectChange("expectedAttendance", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select expected attendance" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {expectedAttendance.map((range) => (
                                                <SelectItem key={range.value} value={range.value}>
                                                    {range.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="freeEvent"
                                            checked={formData.freeEvent}
                                            onCheckedChange={(checked) => handleCheckboxChange("freeEvent", checked as boolean)}
                                        />
                                        <Label htmlFor="freeEvent">This is a free event</Label>
                                    </div>

                                    {!formData.freeEvent && (
                                        <div>
                                            <Label htmlFor="ticketPrice">Ticket Price (USD) *</Label>
                                            <Input
                                                id="ticketPrice"
                                                name="ticketPrice"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.ticketPrice}
                                                onChange={handleInputChange}
                                                required={!formData.freeEvent}
                                                placeholder="25.00"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ageRestriction">Age Restriction</Label>
                                    <Select
                                        value={formData.ageRestriction}
                                        onValueChange={(value) => handleSelectChange("ageRestriction", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select age restriction" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all-ages">All Ages</SelectItem>
                                            <SelectItem value="18+">18+ Only</SelectItem>
                                            <SelectItem value="21+">21+ Only</SelectItem>
                                            <SelectItem value="family">Family Friendly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label>Event Features</Label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="foodVendors"
                                                checked={formData.foodVendors}
                                                onCheckedChange={(checked) => handleCheckboxChange("foodVendors", checked as boolean)}
                                            />
                                            <Label htmlFor="foodVendors" className="text-sm">
                                                Food Vendors Available
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="alcoholServed"
                                                checked={formData.alcoholServed}
                                                onCheckedChange={(checked) => handleCheckboxChange("alcoholServed", checked as boolean)}
                                            />
                                            <Label htmlFor="alcoholServed" className="text-sm">
                                                Alcohol Will Be Served
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                                    <Textarea
                                        id="specialRequirements"
                                        name="specialRequirements"
                                        value={formData.specialRequirements}
                                        onChange={handleInputChange}
                                        placeholder="Any special equipment, setup requirements, or considerations..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 6: Legal & Agreement */}
                    {currentStep === 6 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Legal Information & Agreement</CardTitle>
                                <CardDescription>Final details and terms acceptance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="insuranceInfo">Insurance Information</Label>
                                    <Textarea
                                        id="insuranceInfo"
                                        name="insuranceInfo"
                                        value={formData.insuranceInfo}
                                        onChange={handleInputChange}
                                        placeholder="Details about your event insurance coverage..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="permitsObtained"
                                        checked={formData.permitsObtained}
                                        onCheckedChange={(checked) => handleCheckboxChange("permitsObtained", checked as boolean)}
                                    />
                                    <Label htmlFor="permitsObtained" className="text-sm">
                                        I have obtained or will obtain all necessary permits and licenses
                                    </Label>
                                </div>

                                <div>
                                    <Label htmlFor="emergencyPlan">Emergency Plan</Label>
                                    <Textarea
                                        id="emergencyPlan"
                                        name="emergencyPlan"
                                        value={formData.emergencyPlan}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of your emergency and safety plan..."
                                        rows={3}
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="termsAccepted"
                                            checked={formData.termsAccepted}
                                            onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
                                        />
                                        <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                                            I agree to the{" "}
                                            <a href="/terms" className="text-purple-600 hover:underline">
                                                Terms of Service
                                            </a>{" "}
                                            and{" "}
                                            <a href="/organizer-agreement" className="text-purple-600 hover:underline">
                                                Festival Organizer Agreement
                                            </a>
                                        </Label>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="dataProcessingAccepted"
                                            checked={formData.dataProcessingAccepted}
                                            onCheckedChange={(checked) => handleCheckboxChange("dataProcessingAccepted", checked as boolean)}
                                        />
                                        <Label htmlFor="dataProcessingAccepted" className="text-sm leading-relaxed">
                                            I consent to the processing of my personal data as described in the{" "}
                                            <a href="/privacy" className="text-purple-600 hover:underline">
                                                Privacy Policy
                                            </a>
                                        </Label>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-800 mb-2">Review Process</h4>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• Applications are reviewed within 3-5 business days</li>
                                        <li>• We may request additional information or documentation</li>
                                        <li>• Approved festivals will be contacted to complete setup</li>
                                        <li>• A 5% platform fee applies to all ticket sales</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            ← Previous
                        </Button>

                        <div className="flex gap-4">
                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isStepValid(currentStep)}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                                >
                                    Next →
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={!isStepValid(currentStep) || isSubmitting}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Submit Application
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
