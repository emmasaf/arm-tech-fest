'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

// Types
interface SupportTicket {
  id: string
  subject: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  category: string
  user: {
    id: string
    name: string
    email: string
  }
  assignee?: {
    id: string
    name: string
    email: string
  }
  resolution?: string
  createdAt: string
  updatedAt: string
  closedAt?: string
}

interface SupportTicketsResponse {
  tickets: SupportTicket[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface SupportTicketsFilters {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assignedToMe?: boolean
  page?: number
  limit?: number
}

interface CreateSupportTicketData {
  subject: string
  description: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
}

interface UpdateSupportTicketData {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  assignedTo?: string
  resolution?: string
}

// Get support tickets with filters
export const useSupportTickets = (filters: SupportTicketsFilters = {}) => {
  const queryParams = new URLSearchParams()
  
  if (filters.status) queryParams.set('status', filters.status)
  if (filters.priority) queryParams.set('priority', filters.priority)
  if (filters.assignedToMe) queryParams.set('assignedToMe', 'true')
  if (filters.page) queryParams.set('page', filters.page.toString())
  if (filters.limit) queryParams.set('limit', filters.limit.toString())

  return useQuery({
    queryKey: ['support-tickets', filters],
    queryFn: async (): Promise<SupportTicketsResponse> => {
      const response = await fetch(`/api/support/tickets?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch support tickets')
      }
      return response.json()
    },
    staleTime: 1 * 60 * 1000, // 1 minute for real-time support data
  })
}

// Get my support tickets (for users)
export const useMySupportTickets = () => {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['my-support-tickets', session?.user?.id],
    queryFn: async (): Promise<SupportTicketsResponse> => {
      const response = await fetch('/api/support/tickets')
      if (!response.ok) {
        throw new Error('Failed to fetch my support tickets')
      }
      return response.json()
    },
    enabled: !!session?.user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get tickets assigned to me (for support staff)
export const useMyAssignedTickets = () => {
  const { data: session } = useSession()

  return useSupportTickets({
    assignedToMe: true
  })
}

// Get open support tickets (for support dashboard)
export const useOpenSupportTickets = (limit: number = 20) => {
  return useSupportTickets({
    status: 'OPEN',
    limit
  })
}

// Get single support ticket
export const useSupportTicket = (id: string) => {
  return useQuery({
    queryKey: ['support-ticket', id],
    queryFn: async (): Promise<SupportTicket> => {
      const response = await fetch(`/api/support/tickets/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Support ticket not found')
        }
        throw new Error('Failed to fetch support ticket')
      }
      return response.json()
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Create support ticket
export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ticketData: CreateSupportTicketData) => {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create support ticket')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate support tickets queries
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['my-support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Update support ticket (for support staff)
export const useUpdateSupportTicket = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ticketData: UpdateSupportTicketData) => {
      const response = await fetch(`/api/support/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update support ticket')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['support-ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['my-assigned-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Assign ticket to support staff
export const useAssignSupportTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, assigneeId }: { ticketId: string; assigneeId: string }) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTo: assigneeId,
          status: 'IN_PROGRESS'
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to assign support ticket')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate all support ticket queries
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['my-assigned-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Resolve support ticket
export const useResolveSupportTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, resolution }: { ticketId: string; resolution: string }) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'RESOLVED',
          resolution
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to resolve support ticket')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate all support ticket queries
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['my-assigned-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}