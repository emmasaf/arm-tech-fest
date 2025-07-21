import { FestivalCardSkeleton } from "@/components/ui/loading"

export default function FestivalsLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Skeleton */}
                <div className="text-center mb-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
                </div>

                {/* Filters Skeleton */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8 animate-pulse">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Event Cards Skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <FestivalCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}
