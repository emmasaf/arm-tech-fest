"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

const toastStyles: Record<ToastType, { icon: React.ElementType; className: string }> = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 text-green-900 border-green-200",
  },
  error: {
    icon: AlertCircle,
    className: "bg-red-50 text-red-900 border-red-200",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-yellow-50 text-yellow-900 border-yellow-200",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 text-blue-900 border-blue-200",
  },
}

export function Toast({ toast, onRemove }: ToastProps) {
  const { icon: Icon, className } = toastStyles[toast.type]

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md rounded-lg border p-4 shadow-lg transition-all",
        "animate-in slide-in-from-top-5 fade-in duration-300",
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-sm opacity-90">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-4 inline-flex flex-shrink-0 rounded-md hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}