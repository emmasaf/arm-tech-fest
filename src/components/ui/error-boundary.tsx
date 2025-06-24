"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { ErrorDisplay } from "./error"

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo)
        this.props.onError?.(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <ErrorDisplay
                    variant="default"
                    title="Something went wrong"
                    message="An unexpected error occurred in this component."
                    onRetry={() => this.setState({ hasError: false, error: undefined })}
                    showHome={true}
                />
            )
        }

        return this.props.children
    }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, fallback?: ReactNode) {
    return function WrappedComponent(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        )
    }
}
