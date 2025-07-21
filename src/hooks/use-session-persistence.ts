'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function useSessionPersistence() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    useEffect(() => {
        // Function to check and refresh session
        const checkSession = async () => {
            if (session) {
                try {
                    // Update session to refresh JWT token
                    await update()
                    
                    // Store session timestamp
                    localStorage.setItem('session-check', new Date().toISOString())
                } catch (error) {
                    console.error('Failed to refresh session:', error)
                }
            }
        }

        // Check session on mount
        checkSession()

        // Set up interval to check session periodically
        const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL)

        return () => clearInterval(interval)
    }, [session, update])

    // Handle session expiration
    useEffect(() => {
        if (status === 'unauthenticated') {
            const lastCheck = localStorage.getItem('session-check')
            const registeredUser = localStorage.getItem('user-registered')
            
            if (lastCheck) {
                const timeSinceLastCheck = new Date().getTime() - new Date(lastCheck).getTime()
                
                // If session expired recently and user was logged in
                if (timeSinceLastCheck < SESSION_CHECK_INTERVAL * 2) {
                    // Store redirect URL
                    const currentPath = window.location.pathname
                    if (currentPath !== '/login' && currentPath !== '/register') {
                        localStorage.setItem('auth-redirect', currentPath)
                    }
                    
                    // Redirect to login with message
                    router.push('/login?message=Your session has expired. Please log in again.')
                }
                
                // Clear session check timestamp
                localStorage.removeItem('session-check')
            }
        }
    }, [status, router])

    return { session, status }
}