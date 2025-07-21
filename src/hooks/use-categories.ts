'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  createdAt: string
  updatedAt: string
}

interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
}

// API endpoint needs to be created
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  })
}

// Get single category
export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async (): Promise<Category> => {
      const response = await fetch(`/api/categories/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Category not found')
        }
        throw new Error('Failed to fetch category')
      }
      return response.json()
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create category (admin only)
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryData: CreateCategoryData) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create category')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// Update category (admin only)
export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryData: Partial<CreateCategoryData>) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update category')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['category', id] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// Delete category (admin only)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}