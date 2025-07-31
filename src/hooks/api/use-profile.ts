import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/toast-context'

export interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  bio: string | null
  location: string | null
  organization: string | null
  website: string | null
  socialLinks: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
    github?: string
  } | null
  image: string | null
  role: string
  createdAt: string
  updatedAt: string
  emailVerified: string | null
  lastLoginAt: string | null
}

export interface ProfileUpdateData {
  name?: string
  email?: string
  phone?: string
  bio?: string
  location?: string
  organization?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
    github?: string
  }
  currentPassword?: string
  newPassword?: string
}

// Custom hook to fetch user profile
export function useProfile() {
  return useQuery<{ user: UserProfile }>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile')
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch profile')
      }
      
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Custom hook to update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData(['profile'], data)
      
      // Also invalidate to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      addToast('Profile updated successfully', 'success')
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to update profile', 'error')
    }
  })
}

// Custom hook to check if profile data has unsaved changes
export function useProfileChanges(currentData: Partial<ProfileUpdateData>, originalData: UserProfile | undefined) {
  if (!originalData) return false

  const fieldsToCheck: (keyof ProfileUpdateData)[] = [
    'name', 'email', 'phone', 'bio', 'location', 'organization', 'website'
  ]

  return fieldsToCheck.some(field => {
    if (field === 'socialLinks') {
      if (!currentData.socialLinks && !originalData.socialLinks) return false
      if (!currentData.socialLinks || !originalData.socialLinks) return true
      
      const socialFields = ['twitter', 'linkedin', 'facebook', 'instagram', 'github'] as const
      return socialFields.some(social => 
        currentData.socialLinks?.[social] !== (originalData.socialLinks as any)?.[social]
      )
    }
    
    return currentData[field] !== originalData[field]
  })
}