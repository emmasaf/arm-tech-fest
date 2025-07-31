import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateEventRequestParams {
  requestId: string
  status: 'APPROVED' | 'REJECTED'
  reviewNotes?: string
  rejectionReason?: string
}

interface UpdateEventRequestResponse {
  success: boolean
  message: string
  data: {
    eventRequest: any | null
    createdEvent: any
    action: string
  }
}

export function useUpdateEventRequest() {
  const queryClient = useQueryClient()

  return useMutation<UpdateEventRequestResponse, Error, UpdateEventRequestParams>({
    mutationFn: async ({ requestId, status, reviewNotes, rejectionReason }) => {
      const response = await fetch(`/api/event-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status,
          reviewNotes: reviewNotes || undefined,
          rejectionReason: rejectionReason || undefined,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update request')
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update request')
      }
      
      return result
    },
    onSuccess: async () => {
      // Invalidate and refetch the event requests
      await queryClient.invalidateQueries({ queryKey: ['event-requests'] })
    },
  })
}