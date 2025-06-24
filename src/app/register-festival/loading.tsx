import { FormSkeleton } from "@/components/ui/loading"

export default function RegisterFestivalLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg p-8">
                        <FormSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}
