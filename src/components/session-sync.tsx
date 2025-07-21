'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/contexts/auth-context'

export function SessionSync() {
    const { data: session, status } = useSession()
    const { syncSession } = useAuth()

    useEffect(() => {
        // Sync session whenever it changes
        if (status !== 'loading') {
            syncSession()
        }
    }, [session, status, syncSession])

    // This component doesn't render anything
    return null
}