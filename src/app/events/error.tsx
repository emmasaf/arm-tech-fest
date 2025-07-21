"use client"

import { ErrorDisplay } from "@/components/ui/error"

export default function FestivalsError({
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
                    title="Failed to Load Events"
                    message="We couldn't load the event listings. This might be due to a temporary issue with our servers."
                    onRetry={reset}
                    showHome={true}
                    showBack={true}
                />
            </div>
        </div>
    )
}
