'use client'

import {useMutation} from '@tanstack/react-query'
import {signIn, signOut, getSession} from 'next-auth/react'
import {useRouter} from 'next/navigation'

interface RegisterData {
    name: string
    email: string
    password: string
    phone?: string
    organization?: string
}

interface LoginData {
    email: string
    password: string
}

// Registration mutation
export const useRegister = () => {
    const router = useRouter()
    
    return useMutation({
        mutationFn: async (data: RegisterData) => {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Registration failed')
            }

            return response.json()
        },
        onSuccess: (data) => {
            // Store user info in localStorage for persistence
            localStorage.setItem('user-registered', JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                timestamp: new Date().toISOString()
            }))
            
            // Redirect to login page after successful registration
            router.push('/login?message=Registration successful! Please log in.')
        },
    })
}

// Login mutation
export const useLogin = () => {
    const router = useRouter()
    
    return useMutation({
        mutationFn: async (data: LoginData) => {

            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })


            if (result?.error) {
                throw new Error(result.error)
            }

            return result
        },
        onSuccess: async (result) => {
            // Clear any stored registration data
            localStorage.removeItem('user-registered')
            
            // Store session check timestamp
            localStorage.setItem('session-check', new Date().toISOString())
            
            // Force session refresh to update UI
            const session = await getSession()
            
            if (session?.user) {
                // Store auth info for persistence
                localStorage.setItem('auth-user', JSON.stringify({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    role: session.user.role,
                    timestamp: new Date().toISOString()
                }))
            }
            
            // Check for redirect URL
            const redirectUrl = localStorage.getItem('auth-redirect')
            if (redirectUrl) {
                localStorage.removeItem('auth-redirect')
                router.push(redirectUrl)
            } else {
                // Small delay to ensure session is updated
                setTimeout(() => {
                    router.push('/dashboard')
                }, 100)
            }
        },
    })
}

// Logout mutation
export const useLogout = () => {
    const router = useRouter()
    
    return useMutation({
        mutationFn: async () => {
            await signOut({redirect: false})
        },
        onSuccess: () => {
            // Clear all auth-related localStorage
            localStorage.removeItem('user-id')
            localStorage.removeItem('user-role')
            localStorage.removeItem('user-registered')
            localStorage.removeItem('auth-token')
            localStorage.removeItem('auth-user')
            localStorage.removeItem('session-check')
            localStorage.removeItem('auth-redirect')
            
            // Clear session storage as well
            sessionStorage.clear()
            
            // Redirect to home page after logout
            router.push('/')
        },
    })
}