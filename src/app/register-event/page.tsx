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
import { useScrollAnimations } from "@/app/hooks/use-scroll-animation"
import { useMutation } from "@tanstack/react-query"
import { useNotification } from "@/contexts/toast-context"
import { useRouter } from "next/navigation"
import { useTranslations } from "@/contexts/translation-context"

interface FormData {
    // Organizer Information
    organizerName: string
    organizerEmail: string
    organizerPhone: string
    organizationName: string
    organizationWebsite: string
    organizationDescription: string

    // Event Information
    eventName: string
    eventDescription: string
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
    const notification = useNotification()
    const router = useRouter()
    const t = useTranslations()

    // Translation-based arrays
    const festivalCategories = [
        { value: "music", label: t("registerEvent.categories.music") },
        { value: "food", label: t("registerEvent.categories.food") },
        { value: "culture", label: t("registerEvent.categories.culture") },
        { value: "art", label: t("registerEvent.categories.art") },
        { value: "technology", label: t("registerEvent.categories.technology") },
        { value: "sports", label: t("registerEvent.categories.sports") },
        { value: "family", label: t("registerEvent.categories.family") },
        { value: "business", label: t("registerEvent.categories.business") },
        { value: "other", label: t("registerEvent.categories.other") },
    ]

    const venueTypes = [
        { value: "outdoor", label: t("registerEvent.venueTypes.outdoor") },
        { value: "indoor", label: t("registerEvent.venueTypes.indoor") },
        { value: "mixed", label: t("registerEvent.venueTypes.mixed") },
        { value: "virtual", label: t("registerEvent.venueTypes.virtual") },
        { value: "hybrid", label: t("registerEvent.venueTypes.hybrid") },
    ]

    const expectedAttendance = [
        { value: "0-100", label: t("registerEvent.attendance.0-100") },
        { value: "101-500", label: t("registerEvent.attendance.101-500") },
        { value: "501-1000", label: t("registerEvent.attendance.501-1000") },
        { value: "1001-5000", label: t("registerEvent.attendance.1001-5000") },
        { value: "5001-10000", label: t("registerEvent.attendance.5001-10000") },
        { value: "10000+", label: t("registerEvent.attendance.10000+") },
    ]

    const [formData, setFormData] = useState<FormData>({
        organizerName: "Sarah Johnson",
        organizerEmail: "sarah.johnson@musicevents.com",
        organizerPhone: "+1 (555) 123-4567",
        organizationName: "Harmony Music Productions",
        organizationWebsite: "https://harmonymusicprod.com",
        organizationDescription: "Harmony Music Productions is a premier event management company specializing in outdoor music festivals and cultural events. With over 10 years of experience, we've successfully organized 50+ events across the country.",
        eventName: "Summer Harmony Music Festival 2025",
        eventDescription: "Join us for the ultimate summer music experience! Summer Harmony Festival brings together top indie bands, local artists, and emerging talent for a weekend of unforgettable performances. Featuring 3 stages, 40+ artists, artisan food vendors, craft workshops, and a dedicated family zone. This eco-friendly event celebrates music, community, and sustainability.",
        category: "music",
        startDate: "2025-06-15",
        endDate: "2025-07-17",
        startTime: "10:00",
        endTime: "23:00",
        venueName: "Riverside Park Amphitheater",
        venueAddress: "1234 River Road",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        country: "United States",
        venueType: "outdoor",
        expectedAttendance: "1001-5000",
        ticketPrice: "75",
        freeEvent: false,
        ageRestriction: "all-ages",
        accessibility: true,
        parking: true,
        foodVendors: true,
        alcoholServed: true,
        websiteUrl: "https://summerharmonyfest.com",
        socialMediaLinks: "Facebook: https://facebook.com/summerharmonyfest\nInstagram: @summerharmony\nTwitter: @harmonyfest2024",
        previousEvents: "2023 Spring Harmony Festival - 3,500 attendees\n2022 Summer Harmony Festival - 4,200 attendees\n2021 Virtual Harmony Fest - 10,000 online viewers",
        marketingPlan: "Multi-channel marketing campaign including social media advertising, local radio partnerships, influencer collaborations, and street team promotions. Early bird ticket sales starting 3 months prior.",
        specialRequirements: "Need 3-phase power for main stage, water stations throughout venue, dedicated vendor loading area, and backstage artist facilities including green rooms and catering area.",
        insuranceInfo: "General liability coverage through EventGuard Insurance - Policy #EG2024-78901, $2M coverage. Additional vendor insurance required for all food/beverage vendors.",
        permitsObtained: true,
        emergencyPlan: "Comprehensive emergency response plan including on-site medical team, security personnel, evacuation procedures, and coordination with local fire and police departments. Weather monitoring system in place.",
        termsAccepted: true,
        dataProcessingAccepted: true,
    })

    const [currentStep, setCurrentStep] = useState(1)
    
    useScrollAnimations();
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

    const submitEventMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch('/api/event-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit application')
            }
            return result
        },
        onSuccess: () => {
            notification.success(
                t("registerEvent.notifications.applicationSubmitted"),
                t("registerEvent.notifications.reviewMessage")
            )
            // Reset form or redirect after a delay
            setTimeout(() => {
                router.push('/')
            }, 2000)
        },
        onError: (error: Error) => {
            notification.error(
                t("registerEvent.notifications.submissionFailed"),
                error.message || t("registerEvent.notifications.checkConnection")
            )
        },
    })

    const totalSteps = 6

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
        
        // Clear any previous errors when user starts typing
        if (submitEventMutation.isError) {
            submitEventMutation.reset()
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        
        // Clear any previous errors when user makes a selection
        if (submitEventMutation.isError) {
            submitEventMutation.reset()
        }
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }))
        
        // Clear any previous errors when user changes checkbox
        if (submitEventMutation.isError) {
            submitEventMutation.reset()
        }
        
        // Special handling for free event checkbox
        if (name === "freeEvent" && checked) {
            setFormData((prev) => ({
                ...prev,
                ticketPrice: "0",
            }))
        }
    }

    const handleFileUpload = (fileName: string) => {
        setUploadedFiles((prev) => [...prev, fileName])
    }

    const nextStep = () => {
        if (currentStep < totalSteps && isStepValid(currentStep)) {
            notification.success(
                t("registerEvent.notifications.stepCompleted"),
                t("registerEvent.notifications.stepSaved", { step: currentStep.toString() })
            )
            setCurrentStep(currentStep + 1)
        } else if (!isStepValid(currentStep)) {
            notification.warning(
                t("registerEvent.notifications.incompleteStep"),
                t("registerEvent.notifications.fillRequired")
            )
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            notification.info(
                t("registerEvent.notifications.navigation"),
                t("registerEvent.notifications.returnedToStep", { step: (currentStep - 1).toString() })
            )
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate all required fields are filled
        if (!isStepValid(totalSteps)) {
            notification.warning(
                t("registerEvent.notifications.incompleteForm"),
                t("registerEvent.notifications.ensureRequired")
            )
            return
        }

        // Show loading notification
        notification.info(t("registerEvent.notifications.submitting"), t("registerEvent.notifications.processingApplication"))
        
        // Submit the form
        submitEventMutation.mutate(formData)
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.organizerName && formData.organizerEmail && formData.organizerPhone && formData.organizationName
            case 2:
                return formData.eventName && formData.eventDescription && formData.category
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

    if (submitEventMutation.isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-4">
                    <Card className="border-green-200 bg-green-50 animate-scale-in">
                        <CardContent className="pt-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-green-800 mb-4 scroll-fade-up scroll-delay-200">{t("registerEvent.success.title")}</h1>
                            <p className="text-green-700 mb-6">
                                {t("registerEvent.success.message")}
                            </p>
                            <div className="bg-white rounded-lg p-4 mb-6">
                                <h3 className="font-semibold mb-2">{t("registerEvent.success.nextSteps.title")}</h3>
                                <ul className="text-sm text-gray-600 space-y-1 text-left">
                                    <li>• {t("registerEvent.success.nextSteps.steps.0")}</li>
                                    <li>• {t("registerEvent.success.nextSteps.steps.1")}</li>
                                    <li>• {t("registerEvent.success.nextSteps.steps.2")}</li>
                                    <li>• {t("registerEvent.success.nextSteps.steps.3")}</li>
                                </ul>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-fade-up scroll-delay-600">
                                <Button onClick={() => router.push("/")} className="hover-glow">{t("registerEvent.buttons.backToHome")}</Button>
                                <Button variant="outline" onClick={() => router.push("/events")} className="hover-lift">
                                    {t("registerEvent.buttons.browseEvents")}
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
                    <h1 className="text-4xl font-bold mb-4 ">{t("registerEvent.title")}</h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto ">
                        {t("registerEvent.subtitle")}
                    </p>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0"></div>
                        <div 
                            className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 z-0 transition-all duration-500 ease-in-out"
                            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        ></div>
                        
                        {/* Step Indicators */}
                        <div className="relative flex justify-between">
                            {[
                                { step: 1, title: t("registerEvent.steps.organizer"), icon: Users },
                                { step: 2, title: t("registerEvent.steps.eventInfo"), icon: Calendar },
                                { step: 3, title: t("registerEvent.steps.dateTime"), icon: Calendar },
                                { step: 4, title: t("registerEvent.steps.location"), icon: MapPin },
                                { step: 5, title: t("registerEvent.steps.details"), icon: DollarSign },
                                { step: 6, title: t("registerEvent.steps.agreement"), icon: CheckCircle }
                            ].map(({ step, title, icon: Icon }) => {
                                const isCompleted = step < currentStep
                                const isCurrent = step === currentStep
                                const isUpcoming = step > currentStep
                                
                                return (
                                    <div key={step} className="flex flex-col items-center relative z-10">
                                        <div
                                            className={`
                                                w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                                                transition-all duration-300 ease-in-out transform
                                                ${
                                                    isCompleted
                                                        ? "bg-purple-600 text-white shadow-lg scale-110 ring-4 ring-purple-100"
                                                        : isCurrent
                                                            ? "bg-white text-purple-600 border-4 border-purple-600 shadow-lg scale-110 ring-4 ring-purple-50"
                                                            : "bg-white text-gray-400 border-2 border-gray-200 hover:border-gray-300"
                                                }
                                            `}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="mt-3 text-center">
                                            <div className={`
                                                text-sm font-medium transition-colors duration-200
                                                ${
                                                    isCompleted || isCurrent
                                                        ? "text-purple-600"
                                                        : "text-gray-500"
                                                }
                                            `}>
                                                {title}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {t("registerEvent.progress.step")} {step}
                                            </div>
                                        </div>
                                        
                                        {/* Active indicator pulse */}
                                        {isCurrent && (
                                            <div className="absolute -inset-2 rounded-full bg-purple-600 opacity-20 animate-pulse"></div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* Progress Summary */}
                    <div className="text-center mt-6">
                        <div className="text-lg font-semibold text-gray-800 mb-1">
                            {[
                                t("registerEvent.stepTitles.organizer"),
                                t("registerEvent.stepTitles.eventInfo"), 
                                t("registerEvent.stepTitles.dateTime"),
                                t("registerEvent.stepTitles.location"),
                                t("registerEvent.stepTitles.details"),
                                t("registerEvent.stepTitles.agreement")
                            ][currentStep - 1]}
                        </div>
                        <div className="text-sm text-gray-500">
                            {t("registerEvent.progress.step")} {currentStep} {t("registerEvent.progress.of")} {totalSteps} • {Math.round((currentStep / totalSteps) * 100)}% {t("registerEvent.progress.complete")}
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mx-auto mt-2">
                            <div 
                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Error Display - Show mutation error if any */}
                {submitEventMutation.isError && (
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-red-800 mb-1">{t("registerEvent.errors.submissionFailed")}</h3>
                                    <p className="text-sm text-red-700">
                                        {submitEventMutation.error?.message || t("registerEvent.errors.failedToSubmit")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    {/* Step 1: Organizer Information */}
                    {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {t("registerEvent.organizer.title")}
                                </CardTitle>
                                <CardDescription>{t("registerEvent.organizer.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="organizerName">{t("registerEvent.organizer.fullName")} *</Label>
                                        <Input
                                            id="organizerName"
                                            name="organizerName"
                                            value={formData.organizerName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t("registerEvent.organizer.placeholders.fullName")}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="organizerEmail">{t("registerEvent.organizer.email")} *</Label>
                                        <Input
                                            id="organizerEmail"
                                            name="organizerEmail"
                                            type="email"
                                            value={formData.organizerEmail}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t("registerEvent.organizer.placeholders.email")}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="organizerPhone">{t("registerEvent.organizer.phone")} *</Label>
                                        <Input
                                            id="organizerPhone"
                                            name="organizerPhone"
                                            type="tel"
                                            value={formData.organizerPhone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t("registerEvent.organizer.placeholders.phone")}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="organizationName">{t("registerEvent.organizer.organizationName")} *</Label>
                                        <Input
                                            id="organizationName"
                                            name="organizationName"
                                            value={formData.organizationName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t("registerEvent.organizer.placeholders.organizationName")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="organizationWebsite">{t("registerEvent.organizer.organizationWebsite")}</Label>
                                    <Input
                                        id="organizationWebsite"
                                        name="organizationWebsite"
                                        type="url"
                                        value={formData.organizationWebsite}
                                        onChange={handleInputChange}
                                        placeholder={t("registerEvent.organizer.placeholders.organizationWebsite")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="organizationDescription">{t("registerEvent.organizer.organizationDescription")} *</Label>
                                    <Textarea
                                        id="organizationDescription"
                                        name="organizationDescription"
                                        value={formData.organizationDescription}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t("registerEvent.organizer.placeholders.organizationDescription")}
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Event Information */}
                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    {t("registerEvent.eventInfo.title")}
                                </CardTitle>
                                <CardDescription>{t("registerEvent.eventInfo.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="eventName">{t("registerEvent.eventInfo.eventName")} *</Label>
                                    <Input
                                        id="eventName"
                                        name="eventName"
                                        value={formData.eventName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t("registerEvent.eventInfo.placeholders.eventName")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="category">{t("registerEvent.eventInfo.category")} *</Label>
                                    <Select value={formData.category || undefined} onValueChange={(value) => handleSelectChange("category", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("registerEvent.eventInfo.placeholders.category")} />
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
                                    <Label htmlFor="eventDescription">{t("registerEvent.eventInfo.eventDescription")} *</Label>
                                    <Textarea
                                        id="eventDescription"
                                        name="eventDescription"
                                        value={formData.eventDescription}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t("registerEvent.eventInfo.placeholders.eventDescription")}
                                        rows={6}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="websiteUrl">{t("registerEvent.eventInfo.eventWebsite")}</Label>
                                    <Input
                                        id="websiteUrl"
                                        name="websiteUrl"
                                        type="url"
                                        value={formData.websiteUrl}
                                        onChange={handleInputChange}
                                        placeholder={t("registerEvent.eventInfo.placeholders.eventWebsite")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="socialMediaLinks">{t("registerEvent.eventInfo.socialMediaLinks")}</Label>
                                    <Textarea
                                        id="socialMediaLinks"
                                        name="socialMediaLinks"
                                        value={formData.socialMediaLinks}
                                        onChange={handleInputChange}
                                        placeholder={t("registerEvent.eventInfo.placeholders.socialMediaLinks")}
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
                                    {t("registerEvent.dateTime.title")}
                                </CardTitle>
                                <CardDescription>{t("registerEvent.dateTime.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate">{t("registerEvent.dateTime.startDate")} *</Label>
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
                                        <Label htmlFor="endDate">{t("registerEvent.dateTime.endDate")} *</Label>
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
                                        <Label htmlFor="startTime">{t("registerEvent.dateTime.startTime")} *</Label>
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
                                        <Label htmlFor="endTime">{t("registerEvent.dateTime.endTime")} *</Label>
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
                                            <h4 className="font-medium text-blue-800 mb-1">{t("registerEvent.dateTime.guidelines.title")}</h4>
                                            <ul className="text-sm text-blue-700 space-y-1">
                                                <li>• {t("registerEvent.dateTime.guidelines.rules.0")}</li>
                                                <li>• {t("registerEvent.dateTime.guidelines.rules.1")}</li>
                                                <li>• {t("registerEvent.dateTime.guidelines.rules.2")}</li>
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
                                    {t("registerEvent.location.title")}
                                </CardTitle>
                                <CardDescription>{t("registerEvent.location.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="venueName">{t("registerEvent.location.venueName")} *</Label>
                                    <Input
                                        id="venueName"
                                        name="venueName"
                                        value={formData.venueName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t("registerEvent.location.placeholders.venueName")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="venueAddress">{t("registerEvent.location.venueAddress")} *</Label>
                                    <Input
                                        id="venueAddress"
                                        name="venueAddress"
                                        value={formData.venueAddress}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t("registerEvent.location.placeholders.venueAddress")}
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="city">{t("registerEvent.location.city")} *</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t("registerEvent.location.placeholders.city")}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">{t("registerEvent.location.state")} *</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t("registerEvent.location.placeholders.state")}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="zipCode">{t("registerEvent.location.zipCode")}</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder={t("registerEvent.location.placeholders.zipCode")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="country">{t("registerEvent.location.country")}</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder={t("registerEvent.location.placeholders.country")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="venueType">{t("registerEvent.location.venueType")} *</Label>
                                    <Select value={formData.venueType || undefined} onValueChange={(value) => handleSelectChange("venueType", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("registerEvent.location.placeholders.venueType")} />
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
                                    <Label>{t("registerEvent.location.venueAmenities")}</Label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="accessibility"
                                                checked={formData.accessibility}
                                                onCheckedChange={(checked) => handleCheckboxChange("accessibility", checked as boolean)}
                                            />
                                            <Label htmlFor="accessibility" className="text-sm">
                                                {t("registerEvent.location.wheelchairAccessible")}
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="parking"
                                                checked={formData.parking}
                                                onCheckedChange={(checked) => handleCheckboxChange("parking", checked as boolean)}
                                            />
                                            <Label htmlFor="parking" className="text-sm">
                                                {t("registerEvent.location.parkingAvailable")}
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
                                    {t("registerEvent.details.title")}
                                </CardTitle>
                                <CardDescription>{t("registerEvent.details.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="expectedAttendance">{t("registerEvent.details.expectedAttendance")} *</Label>
                                    <Select
                                        value={formData.expectedAttendance || undefined}
                                        onValueChange={(value) => handleSelectChange("expectedAttendance", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("registerEvent.details.placeholders.expectedAttendance")} />
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
                                        <Label htmlFor="freeEvent">{t("registerEvent.details.freeEvent")}</Label>
                                    </div>

                                    {!formData.freeEvent && (
                                        <div>
                                            <Label htmlFor="ticketPrice">{t("registerEvent.details.ticketPrice")} *</Label>
                                            <Input
                                                id="ticketPrice"
                                                name="ticketPrice"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.ticketPrice}
                                                onChange={handleInputChange}
                                                required={!formData.freeEvent}
                                                placeholder={t("registerEvent.details.placeholders.ticketPrice")}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ageRestriction">{t("registerEvent.details.ageRestriction")}</Label>
                                    <Select
                                        value={formData.ageRestriction || undefined}
                                        onValueChange={(value) => handleSelectChange("ageRestriction", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("registerEvent.details.placeholders.ageRestriction")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all-ages">{t("registerEvent.ageRestrictions.all-ages")}</SelectItem>
                                            <SelectItem value="18+">{t("registerEvent.ageRestrictions.18+")}</SelectItem>
                                            <SelectItem value="21+">{t("registerEvent.ageRestrictions.21+")}</SelectItem>
                                            <SelectItem value="family">{t("registerEvent.ageRestrictions.family")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label>{t("registerEvent.details.eventFeatures")}</Label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="foodVendors"
                                                checked={formData.foodVendors}
                                                onCheckedChange={(checked) => handleCheckboxChange("foodVendors", checked as boolean)}
                                            />
                                            <Label htmlFor="foodVendors" className="text-sm">
                                                {t("registerEvent.details.foodVendors")}
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="alcoholServed"
                                                checked={formData.alcoholServed}
                                                onCheckedChange={(checked) => handleCheckboxChange("alcoholServed", checked as boolean)}
                                            />
                                            <Label htmlFor="alcoholServed" className="text-sm">
                                                {t("registerEvent.details.alcoholServed")}
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="specialRequirements">{t("registerEvent.details.specialRequirements")}</Label>
                                    <Textarea
                                        id="specialRequirements"
                                        name="specialRequirements"
                                        value={formData.specialRequirements}
                                        onChange={handleInputChange}
                                        placeholder={t("registerEvent.details.placeholders.specialRequirements")}
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
                                <CardTitle>{t("registerEvent.agreement.title")}</CardTitle>
                                <CardDescription>{t("registerEvent.agreement.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="insuranceInfo">{t("registerEvent.agreement.insuranceInfo")}</Label>
                                    <Textarea
                                        id="insuranceInfo"
                                        name="insuranceInfo"
                                        value={formData.insuranceInfo}
                                        onChange={handleInputChange}
                                        placeholder={t("registerEvent.agreement.placeholders.insuranceInfo")}
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
                                        {t("registerEvent.agreement.permitsObtained")}
                                    </Label>
                                </div>

                                <div>
                                    <Label htmlFor="emergencyPlan">{t("registerEvent.agreement.emergencyPlan")}</Label>
                                    <Textarea
                                        id="emergencyPlan"
                                        name="emergencyPlan"
                                        value={formData.emergencyPlan}
                                        onChange={handleInputChange}
                                        placeholder={t("registerEvent.agreement.placeholders.emergencyPlan")}
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
                                            {t("registerEvent.agreement.termsAccepted")}
                                        </Label>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="dataProcessingAccepted"
                                            checked={formData.dataProcessingAccepted}
                                            onCheckedChange={(checked) => handleCheckboxChange("dataProcessingAccepted", checked as boolean)}
                                        />
                                        <Label htmlFor="dataProcessingAccepted" className="text-sm leading-relaxed">
                                            {t("registerEvent.agreement.dataProcessingAccepted")}
                                        </Label>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-800 mb-2">{t("registerEvent.agreement.reviewProcess.title")}</h4>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• {t("registerEvent.agreement.reviewProcess.rules.0")}</li>
                                        <li>• {t("registerEvent.agreement.reviewProcess.rules.1")}</li>
                                        <li>• {t("registerEvent.agreement.reviewProcess.rules.2")}</li>
                                        <li>• {t("registerEvent.agreement.reviewProcess.rules.3")}</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Enhanced Navigation Buttons */}
                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`
                                flex items-center gap-2 px-6 py-3 transition-all duration-200
                                ${currentStep === 1 
                                    ? "opacity-50 cursor-not-allowed" 
                                    : "hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-0.5"
                                }
                            `}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {t("registerEvent.buttons.previous")}
                        </Button>

                        {/* Step indicator dots */}
                        <div className="flex items-center space-x-2">
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <div
                                    key={i}
                                    className={`
                                        w-2 h-2 rounded-full transition-all duration-200
                                        ${
                                            i + 1 <= currentStep
                                                ? "bg-purple-600"
                                                : "bg-gray-300"
                                        }
                                    `}
                                />
                            ))}
                        </div>

                        <div className="flex gap-4">
                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isStepValid(currentStep)}
                                    className={`
                                        flex items-center gap-2 px-8 py-3 text-white font-semibold
                                        transition-all duration-200 transform
                                        ${
                                            !isStepValid(currentStep)
                                                ? "bg-gray-400 cursor-not-allowed opacity-50"
                                                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-purple-300"
                                        }
                                    `}
                                >
                                    {t("registerEvent.buttons.continue")}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={!isStepValid(currentStep) || submitEventMutation.isPending}
                                    className={`
                                        flex items-center gap-2 px-8 py-3 text-white font-semibold
                                        transition-all duration-200 transform
                                        ${
                                            !isStepValid(currentStep) || submitEventMutation.isPending
                                                ? "bg-gray-400 cursor-not-allowed opacity-50"
                                                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-green-300"
                                        }
                                    `}
                                >
                                    {submitEventMutation.isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            {t("registerEvent.buttons.submittingApplication")}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5" />
                                            {t("registerEvent.buttons.submitApplication")}
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
