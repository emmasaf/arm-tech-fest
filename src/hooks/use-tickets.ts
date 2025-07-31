'use client'

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {useSession} from 'next-auth/react'

// Types
interface Ticket {
    id: string
    ticketId: string
    qrCode: string
    buyerName: string
    buyerEmail: string
    buyerPhone?: string
    price: number
    currency: string
    status: 'ACTIVE' | 'USED' | 'CANCELLED'
    qrCodeData: string
    isUsed: boolean
    usedAt?: string
    purchasedAt: string
    updatedAt: string
    eventId: string
    buyerId?: string
    buyer?: {
        id: string
        name: string
        email: string
    }
    event: {
        id: string
        name: string
        slug: string
        description: string
        startDate: string
        endDate: string
        startTime: string
        endTime: string
        venueName: string
        venueAddress: string
        city: string
        state: string
        country: string
        venueType: string
        price: number
        currency: string
        capacity: number
        isFree: boolean
        ageRestriction?: string
        isAccessible: boolean
        hasParking: boolean
        hasFoodVendors: boolean
        servesAlcohol: boolean
        images: string[]
        websiteUrl?: string
        category: {
            id: string
            name: string
            slug: string
            color: string
            icon: string
        }
        organizer: {
            id: string
            name: string
            organization: string
        }
    }
}

interface TicketsResponse {
    tickets: Ticket[]
}

interface TicketPurchaseData {
    eventId: string
    buyerName: string
    buyerEmail: string
    buyerPhone?: string
}

// Get all tickets for current user
export const useUserTickets = (userId?: string) => {
    const {data: session} = useSession()
    const targetUserId = userId || session?.user?.id

    return useQuery({
        queryKey: ['user-tickets', targetUserId],
        queryFn: async (): Promise<TicketsResponse> => {
            const queryParams = new URLSearchParams()
            if (targetUserId) queryParams.set('userId', targetUserId)

            const response = await fetch(`/api/tickets?${queryParams.toString()}`)
            if (!response.ok) {
                throw new Error('Failed to fetch tickets')
            }
            return response.json()
        },
        enabled: !!targetUserId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

// Get tickets for a specific event (admin/organizer use)
export const useFestivalTickets = (eventId: string) => {
    const {data: session} = useSession()

    return useQuery({
        queryKey: ['event-tickets', eventId],
        queryFn: async (): Promise<TicketsResponse> => {
            const response = await fetch(`/api/tickets?eventId=${eventId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch event tickets')
            }
            return response.json()
        },
        enabled: !!eventId && !!session?.user,
        staleTime: 1 * 60 * 1000, // 1 minute
    })
}

// Get single ticket by ID
export const useTicket = (ticketId: string) => {
    return useQuery({
        queryKey: ['ticket', ticketId],
        queryFn: async (): Promise<Ticket> => {
            const response = await fetch(`/api/tickets/${ticketId}`)
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Ticket not found')
                }
                throw new Error('Failed to fetch ticket')
            }
            return response.json()
        },
        enabled: !!ticketId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// Purchase ticket mutation
export const usePurchaseTicket = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (ticketData: TicketPurchaseData) => {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to purchase ticket')
            }

            return response.json()
        },
        onSuccess: async (data) => {
            // Invalidate and refetch relevant queries
            await queryClient.invalidateQueries({queryKey: ['user-tickets']})
            await queryClient.invalidateQueries({queryKey: ['event-tickets', data.ticket.eventId]})
            await queryClient.invalidateQueries({queryKey: ['events']}) // To update available tickets
            await queryClient.invalidateQueries({queryKey: ['event', data.ticket.eventId]})
            await queryClient.invalidateQueries({queryKey: ['dashboard-stats']})
        },
    })
}

// Update ticket mutation
export const useUpdateTicket = (ticketId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (ticketData: Partial<Ticket>) => {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update ticket')
            }

            return response.json()
        },
        onSuccess: async (data) => {
            // Invalidate related queries
            await queryClient.invalidateQueries({queryKey: ['ticket', ticketId]})
            await queryClient.invalidateQueries({queryKey: ['user-tickets']})
            await queryClient.invalidateQueries({queryKey: ['event-tickets', data.eventId]})
        },
    })
}

// Cancel ticket mutation
export const useCancelTicket = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (ticketId: string) => {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to cancel ticket')
            }

            return response.json()
        },
        onSuccess: async (data) => {
            // Invalidate relevant queries
            await queryClient.invalidateQueries({queryKey: ['user-tickets']})
            await queryClient.invalidateQueries({queryKey: ['event-tickets']})
            await queryClient.invalidateQueries({queryKey: ['dashboard-stats']})
        },
    })
}