"use client"

import { AlertTriangle, RefreshCw, Home, ArrowLeft, Wifi, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ErrorProps {
    variant?: "default" | "minimal" | "fullscreen" | "inline"
    title?: string
    message?: string
    code?: string | number
    showRetry?: boolean
    showHome?: boolean
    showBack?: boolean
    onRetry?: () => void
    className?: string
}

export function ErrorDisplay({
                                 variant = "default",
                                 title,
                                 message,
                                 code,
                                 showRetry = true,
                                 showHome = true,
                                 showBack = false,
                                 onRetry,
                                 className,
                             }: ErrorProps) {
    const getErrorIcon = () => {
        if (code === 404) return Home
        if (code === 500) return Server
        if (code === "NETWORK_ERROR") return Wifi
        return AlertTriangle
    }

    const getErrorTitle = () => {
        if (title) return title
        if (code === 404) return "Page Not Found"
        if (code === 500) return "Server Error"
        if (code === "NETWORK_ERROR") return "Connection Error"
        return "Something went wrong"
    }

    const getErrorMessage = () => {
        if (message) return message
        if (code === 404) return "The page you're looking for doesn't exist or has been moved."
        if (code === 500) return "We're experiencing technical difficulties. Please try again later."
        if (code === "NETWORK_ERROR") return "Please check your internet connection and try again."
        return "An unexpected error occurred. Please try again or contact support if the problem persists."
    }

    const ErrorIcon = getErrorIcon()

    if (variant === "minimal") {
        return (
            <div className={cn("flex items-center justify-center p-4 text-center", className)}>
                <div className="space-y-2">
                    <ErrorIcon className="h-8 w-8 text-red-500 mx-auto" />
                    <p className="text-sm text-gray-600">{getErrorMessage()}</p>
                    {showRetry && onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    if (variant === "inline") {
        return (
            <div className={cn("bg-red-50 border border-red-200 rounded-lg p-4", className)}>
                <div className="flex items-start space-x-3">
                    <ErrorIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-800">{getErrorTitle()}</h4>
                        <p className="text-sm text-red-700 mt-1">{getErrorMessage()}</p>
                        {showRetry && onRetry && (
                            <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    if (variant === "fullscreen") {
        return (
            <div className={cn("min-h-screen bg-gray-50 flex items-center justify-center px-4", className)}>
                <div className="max-w-md w-full">
                    <Card>
                        <CardContent className="pt-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ErrorIcon className="h-8 w-8 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{getErrorTitle()}</h1>
                            {code && <p className="text-sm text-gray-500 mb-4">Error Code: {code}</p>}
                            <p className="text-gray-600 mb-6">{getErrorMessage()}</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                {showRetry && onRetry && (
                                    <Button onClick={onRetry}>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Try Again
                                    </Button>
                                )}
                                {showHome && (
                                    <Link href="/">
                                        <Button variant="outline">
                                            <Home className="h-4 w-4 mr-2" />
                                            Go Home
                                        </Button>
                                    </Link>
                                )}
                                {showBack && (
                                    <Button variant="outline" onClick={() => window.history.back()}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Go Back
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Default variant
    return (
        <div className={cn("text-center p-8", className)}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ErrorIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{getErrorTitle()}</h2>
            {code && <p className="text-sm text-gray-500 mb-4">Error Code: {code}</p>}
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{getErrorMessage()}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {showRetry && onRetry && (
                    <Button onClick={onRetry}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                )}
                {showHome && (
                    <Link href="/">
                        <Button variant="outline">
                            <Home className="h-4 w-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                )}
                {showBack && (
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                )}
            </div>
        </div>
    )
}

export function NotFoundError({ className }: { className?: string }) {
    return <ErrorDisplay variant="fullscreen" code={404} className={className} />
}

export function ServerError({ className, onRetry }: { className?: string; onRetry?: () => void }) {
    return <ErrorDisplay variant="fullscreen" code={500} onRetry={onRetry} className={className} />
}

export function NetworkError({ className, onRetry }: { className?: string; onRetry?: () => void }) {
    return <ErrorDisplay variant="default" code="NETWORK_ERROR" onRetry={onRetry} className={className} />
}

export function FormError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
    return (
        <ErrorDisplay
            variant="inline"
            title="Form Error"
            message={message || "Please check your input and try again."}
            onRetry={onRetry}
            showHome={false}
            showBack={false}
        />
    )
}
