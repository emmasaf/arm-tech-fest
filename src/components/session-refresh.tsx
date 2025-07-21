'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

const SESSION_REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes
const SESSION_WARNING_TIME = 2 * 60 * 1000 // 2 minutes before expiration

export function SessionRefresh() {
    const { data: session, status, update } = useSession()
    const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (status === 'authenticated' && session) {
            // Clear any existing timers
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
            if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)

            // Set up automatic session refresh
            refreshTimerRef.current = setInterval(async () => {
                try {
                    await update()
                    // Update session check in localStorage
                    localStorage.setItem('session-check', new Date().toISOString())
                } catch (error) {
                    console.error('Failed to refresh session:', error)
                }
            }, SESSION_REFRESH_INTERVAL)

            // Set up session expiration warning
            const sessionExp = session.expires ? new Date(session.expires).getTime() : 0
            if (sessionExp > 0) {
                const timeUntilExpiry = sessionExp - Date.now() - SESSION_WARNING_TIME
                
                if (timeUntilExpiry > 0) {
                    warningTimerRef.current = setTimeout(() => {
                        // You could show a modal here warning about session expiration
                        console.warn('Session will expire soon. Please save your work.')
                    }, timeUntilExpiry)
                }
            }
        }

        return () => {
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
            if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
        }
    }, [session, status, update])

    // Track user activity to refresh session on activity
    useEffect(() => {
        let lastActivity = Date.now()
        let activityTimer: NodeJS.Timeout | null = null

        const handleActivity = () => {
            const now = Date.now()
            const timeSinceLastActivity = now - lastActivity
            
            // If more than 5 minutes since last activity, refresh session
            if (timeSinceLastActivity > 5 * 60 * 1000 && session) {
                update()
                localStorage.setItem('session-check', new Date().toISOString())
            }
            
            lastActivity = now
        }

        // Listen for user activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true })
        })

        // Check activity every minute
        activityTimer = setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivity
            // If user has been inactive for more than 15 minutes, stop refreshing
            if (timeSinceLastActivity > 15 * 60 * 1000) {
                if (refreshTimerRef.current) {
                    clearInterval(refreshTimerRef.current)
                    refreshTimerRef.current = null
                }
            }
        }, 60 * 1000)

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity)
            })
            if (activityTimer) clearInterval(activityTimer)
        }
    }, [session, update])

    return null
}