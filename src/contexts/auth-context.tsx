'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@/generated/prisma'
import { hasPermission as checkPermission, hasRoleAccess } from '@/lib/auth'

interface AuthUser {
    id: string
    email: string
    name: string | null
    role: Role
    organization: string | null
    image: string | null
}

interface AuthContextType {
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
    hasRole: (roles: Role | Role[]) => boolean
    hasPermission: (permission: string) => boolean
    syncSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status, update } = useSession()
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Sync session with local state and localStorage
    const syncSession = async () => {
        if (session?.user) {
            const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.name || null,
                role: session.user.role as Role,
                organization: session.user.organization || null,
                image: session.user.image || null,
            }
            
            setUser(authUser)
            
            // Store critical auth data in localStorage for persistence
            localStorage.setItem('auth-user', JSON.stringify({
                id: authUser.id,
                email: authUser.email,
                name: authUser.name,
                role: authUser.role,
                organization: authUser.organization,
                timestamp: new Date().toISOString()
            }))
        } else {
            setUser(null)
            // Clear auth data from localStorage
            localStorage.removeItem('auth-user')
            localStorage.removeItem('auth-token')
        }
    }

    // Initialize auth state from session and localStorage
    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true)
            
            // First check if we have a session
            if (session?.user) {
                await syncSession()
            } else if (status === 'unauthenticated') {
                // Check localStorage for recent auth data (useful for SSR)
                const storedAuth = localStorage.getItem('auth-user')
                if (storedAuth) {
                    try {
                        const parsed = JSON.parse(storedAuth)
                        const authAge = new Date().getTime() - new Date(parsed.timestamp).getTime()
                        
                        // If auth data is less than 1 hour old, try to refresh session
                        if (authAge < 60 * 60 * 1000) {
                            await update() // Try to refresh the session
                        } else {
                            // Clear stale auth data
                            localStorage.removeItem('auth-user')
                        }
                    } catch (error) {
                        console.error('Error parsing stored auth:', error)
                        localStorage.removeItem('auth-user')
                    }
                }
            }
            
            setIsLoading(false)
        }

        if (status !== 'loading') {
            initAuth()
        }
    }, [session, status, update])

    // Role checking function
    const hasRole = (roles: Role | Role[]): boolean => {
        if (!user) return false
        return hasRoleAccess(user.role, roles)
    }

    // Permission checking function
    const hasPermission = (permission: string): boolean => {
        if (!user) return false
        return checkPermission(user.role, permission)
    }

    const contextValue: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading: isLoading || status === 'loading',
        hasRole,
        hasPermission,
        syncSession
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// HOC for protecting pages
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    options?: {
        roles?: Role[]
        permissions?: string[]
        redirectTo?: string
    }
) {
    return function AuthenticatedComponent(props: P) {
        const { user, isLoading, hasRole, hasPermission } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading) {
                // Check if user is authenticated
                if (!user) {
                    router.push(options?.redirectTo || '/login')
                    return
                }

                // Check role requirements
                if (options?.roles && !options.roles.some(role => hasRole(role))) {
                    router.push('/unauthorized')
                    return
                }

                // Check permission requirements
                if (options?.permissions && !options.permissions.every(perm => hasPermission(perm))) {
                    router.push('/unauthorized')
                    return
                }
            }
        }, [user, isLoading, hasRole, hasPermission, router])

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            )
        }

        if (!user) {
            return null
        }

        return <Component {...props} />
    }
}