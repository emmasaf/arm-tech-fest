"use client"

import { ErrorDisplay } from "@/components/ui/error"

export default function RegisterFestivalError({
                                                  error,
                                                  reset,
                                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <ErrorDisplay
                    variant="default"
                    title="Registration Form Error"
                    message="We couldn't load the festival registration form. Please try refreshing the page."
                    onRetry={reset}
                    showHome={true}
                    showBack={true}
                />
            </div>
        </div>
    )
}
