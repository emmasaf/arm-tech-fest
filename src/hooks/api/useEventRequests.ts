import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export interface EventRequest {
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
  specialRequirements?: string
  insuranceInfo?: string
  hasPermits: boolean
  emergencyPlan?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewNotes?: string
  rejectionReason?: string
  reviewedAt?: string
  submittedAt: string
  reviewer?: {
    id: string
    name: string
    email: string
  }
}

export interface PaginationInfo {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface EventRequestsResponse {
  success: boolean
  data: EventRequest[]
  pagination: PaginationInfo
  error?: string
}

interface UseEventRequestsParams {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export function useEventRequests({ 
  page = 1, 
  limit = 10, 
  status = '', 
  search = '' 
}: UseEventRequestsParams = {}) {
  const { data: session, status: sessionStatus } = useSession()

  return useQuery<EventRequestsResponse, Error>({
    queryKey: ['event-requests', page, status, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search })
      })

      const response = await fetch(`/api/event-requests?${params}`, {
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch event requests')
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch event requests')
      }
      
      return data
    },
    enabled: sessionStatus !== 'loading' && !!session?.user && 
             ['MODERATOR', 'SUPER_ADMIN'].includes(session.user.role || ''),
  })
}