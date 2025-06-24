import { TableSkeleton } from "@/components/ui/loading"

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Skeleton */}
                <div className="mb-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-96 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-lg p-6">
                    <TableSkeleton rows={8} cols={5} />
                </div>
            </div>
        </div>
    )
}
