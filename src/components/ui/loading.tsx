import { Loader2, Calendar, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
    variant?: "default" | "minimal" | "festival" | "fullscreen"
    size?: "sm" | "md" | "lg"
    text?: string
    className?: string
}

export function Loading({ variant = "default", size = "md", text, className }: LoadingProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    }

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    }

    if (variant === "minimal") {
        return (
            <div className={cn("flex items-center justify-center p-4", className)}>
                <Loader2 className={cn("animate-spin text-purple-600", sizeClasses[size])} />
                {text && <span className={cn("ml-2 text-gray-600", textSizeClasses[size])}>{text}</span>}
            </div>
        )
    }

    if (variant === "festival") {
        return (
            <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
                <div className="relative">
                    <div className="absolute inset-0 animate-ping">
                        <Calendar className="h-12 w-12 text-purple-400 opacity-75" />
                    </div>
                    <Calendar className="h-12 w-12 text-purple-600" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{text || "Loading Festival Data..."}</h3>
                    <p className="text-sm text-gray-500">Please wait while we fetch the latest information</p>
                </div>
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                </div>
            </div>
        )
    }

    if (variant === "fullscreen") {
        return (
            <div
                className={cn("fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center", className)}
            >
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4">
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-16 h-16">
                            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-2 flex items-center justify-center">
                                <Ticket className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{text || "Processing..."}</h3>
                            <p className="text-sm text-gray-500">This may take a few moments</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Default variant
    return (
        <div className={cn("flex flex-col items-center justify-center p-6 space-y-4", className)}>
            <div className="relative">
                <Loader2 className={cn("animate-spin text-purple-600", sizeClasses[size])} />
            </div>
            {text && <p className={cn("text-gray-600 text-center", textSizeClasses[size])}>{text}</p>}
        </div>
    )
}

// Skeleton loading components
export function FestivalCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="space-y-4 animate-pulse">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                    {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export function FormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
    )
}
