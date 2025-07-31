'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types
interface EventRequest {
  id: string
  organizerName: string
  organizerEmail: string
  organizerPhone: string
  organizationName: string
  organizationWebsite?: string
  organizationDescription: string
  eventName: string
  eventDescription: string
  category: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  venueName: string
  venueAddress: string
  city: string
  state: string
  zipCode?: string
  country: string
  venueType: string
  expectedAttendance: string
  ticketPrice?: number
  isFree: boolean
  ageRestriction?: string
  isAccessible: boolean
  hasParking: boolean
  hasFoodVendors: boolean
  servesAlcohol: boolean
  websiteUrl?: string
  socialMediaLinks?: string
  previousEvents?: string
  marketingPlan?: string
  specialRequirements?: string
  insuranceInfo?: string
  hasPermits: boolean
  emergencyPlan?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  reviewNotes?: string
  rejectionReason?: string
  reviewer?: {
    id: string
    name: string
    email: string
  }
  submittedAt: string
  reviewedAt?: string
  updatedAt: string
}

interface FestivalRequestsResponse {
  requests: EventRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface FestivalRequestsFilters {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  page?: number
  limit?: number
}

interface ReviewFestivalRequestData {
  status: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  reviewNotes?: string
  rejectionReason?: string
}

// Get event requests with filters
export const useFestivalRequests = (filters: FestivalRequestsFilters = {}) => {
  const queryParams = new URLSearchParams()
  
  if (filters.status) queryParams.set('status', filters.status)
  if (filters.page) queryParams.set('page', filters.page.toString())
  if (filters.limit) queryParams.set('limit', filters.limit.toString())

  return useQuery({
    queryKey: ['event-requests', filters],
    queryFn: async (): Promise<FestivalRequestsResponse> => {
      const response = await fetch(`/api/moderation/event-requests?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event requests')
      }
      return response.json()
    },
    staleTime: 1 * 60 * 1000, // 1 minute for moderation data
  })
}

// Get pending event requests (for moderator dashboard)
export const usePendingFestivalRequests = (limit: number = 20) => {
  return useFestivalRequests({
    status: 'PENDING',
    limit
  })
}

// Get all pending reviews (for moderator stats)
export const usePendingReviews = () => {
  return useFestivalRequests({
    status: 'PENDING'
  })
}

// Get requests under review
export const useRequestsUnderReview = () => {
  return useFestivalRequests({
    status: 'UNDER_REVIEW'
  })
}

// Get single event request
export const useFestivalRequest = (id: string) => {
  return useQuery({
    queryKey: ['event-request', id],
    queryFn: async (): Promise<EventRequest> => {
      const response = await fetch(`/api/moderation/event-requests/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event request not found')
        }
        throw new Error('Failed to fetch event request')
      }
      return response.json()
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Review event request
export const useReviewFestivalRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      reviewData 
    }: { 
      requestId: string
      reviewData: ReviewFestivalRequestData 
    }) => {
      const response = await fetch(`/api/moderation/event-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to review event request')
      }
      
      return response.json()
    },
    onSuccess: async () => {
      // Invalidate event requests queries
      await queryClient.invalidateQueries({ queryKey: ['event-requests'] })
      await queryClient.invalidateQueries({ queryKey: ['pending-event-requests'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      // Also invalidate events list in case of approval
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
