'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider as AuthContextProvider } from '@/contexts/auth-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
}