'use client'

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {useSession} from 'next-auth/react'

// Types
interface Event {
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
    socialMediaLinks?: string
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
    ticketsSold: number
    availableTickets: number
    createdAt: string
    publishedAt?: string
}

interface FestivalsResponse {
    events: Event[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

interface FestivalsFilters {
    category?: string
    search?: string
    upcoming?: boolean
    featured?: boolean
    organizerId?: string
    page?: number
    limit?: number
}

// Get all events with filters
export const useEvents = (filters: FestivalsFilters = {}) => {
    const queryParams = new URLSearchParams()

    if (filters.category) queryParams.set('category', filters.category)
    if (filters.search) queryParams.set('search', filters.search)
    if (filters.upcoming) queryParams.set('upcoming', 'true')
    if (filters.featured) queryParams.set('featured', 'true')
    if (filters.organizerId) queryParams.set('organizerId', filters.organizerId)
    if (filters.page) queryParams.set('page', filters.page.toString())
    if (filters.limit) queryParams.set('limit', filters.limit.toString())

    return useQuery({
        queryKey: ['events', filters],
        queryFn: async (): Promise<FestivalsResponse> => {
            const response = await fetch(`/api/events?${queryParams.toString()}`)
            if (!response.ok) {
                throw new Error('Failed to fetch events')
            }
            return response.json()
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// Get featured events (for home page)
export const useFeaturedEvents = (limit: number = 6) => {
    return useEvents({
        featured: true,
        upcoming: true,
        limit
    })
}

// Get upcoming events
export const useUpcomingEvents = (limit: number = 12) => {
    return useEvents({
        upcoming: true,
        limit
    })
}

// Get single event by ID
export const useEvent = (id: string) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: async (): Promise<Event> => {
            const response = await fetch(`/api/events/${id}`)
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Event not found')
                }
                throw new Error('Failed to fetch event')
            }
            return response.json()
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// Get events by organizer (for organizer dashboard)
export const useOrganizerEvents = (organizerId?: string) => {
    const {data: session} = useSession()
    const targetOrganizerId = organizerId || session?.user?.id

    return useQuery({
        queryKey: ['organizer-events', targetOrganizerId],
        queryFn: async (): Promise<FestivalsResponse> => {
            const response = await fetch(`/api/events?organizerId=${targetOrganizerId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch organizer events')
            }
            return response.json()
        },
        enabled: !!targetOrganizerId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

// Create new event
export const useCreateEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (festivalData: Partial<Event>) => {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(festivalData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create event')
            }

            return response.json()
        },
        onSuccess: () => {
            // Invalidate and refetch events
            queryClient.invalidateQueries({queryKey: ['events']})
            queryClient.invalidateQueries({queryKey: ['organizer-events']})
            queryClient.invalidateQueries({queryKey: ['dashboard-stats']})
        },
    })
}

// Update event
export const useUpdateEvent = (id: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (festivalData: Partial<Event>) => {
            const response = await fetch(`/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(festivalData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update event')
            }

            return response.json()
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({queryKey: ['event', id]})
            queryClient.invalidateQueries({queryKey: ['events']})
            queryClient.invalidateQueries({queryKey: ['organizer-events']})
            queryClient.invalidateQueries({queryKey: ['dashboard-stats']})
        },
    })
}

// Delete event
export const useDeleteEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to delete event')
            }

            return response.json()
        },
        onSuccess: () => {
            // Invalidate all event-related queries
            queryClient.invalidateQueries({queryKey: ['events']})
            queryClient.invalidateQueries({queryKey: ['organizer-events']})
            queryClient.invalidateQueries({queryKey: ['dashboard-stats']})
        },
    })
}