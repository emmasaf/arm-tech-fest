import { z } from 'zod'

// Profile information schema
export const profileInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().refine((val) => {
    if (!val) return true
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ''))
  }, 'Invalid phone number format'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  organization: z.string().max(100, 'Organization must be less than 100 characters').optional(),
  website: z.string().optional().refine((val) => {
    if (!val) return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'Invalid website URL'),
})

// Social links schema
export const socialLinksSchema = z.object({
  twitter: z.string().optional().refine((val) => {
    if (!val) return true
    return val.includes('twitter.com') || val.includes('x.com') || val.startsWith('@')
  }, 'Invalid Twitter URL or handle'),
  linkedin: z.string().optional().refine((val) => {
    if (!val) return true
    return val.includes('linkedin.com')
  }, 'Invalid LinkedIn URL'),
  facebook: z.string().optional().refine((val) => {
    if (!val) return true
    return val.includes('facebook.com')
  }, 'Invalid Facebook URL'),
  instagram: z.string().optional().refine((val) => {
    if (!val) return true
    return val.includes('instagram.com') || val.startsWith('@')
  }, 'Invalid Instagram URL or handle'),
  github: z.string().optional().refine((val) => {
    if (!val) return true
    return val.includes('github.com')
  }, 'Invalid GitHub URL'),
})

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password must be less than 100 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword'],
})

// Combined profile schema
export const profileSchema = z.object({
  ...profileInfoSchema.shape,
  socialLinks: socialLinksSchema.optional(),
})

// Profile with password change schema
export const profileWithPasswordSchema = profileSchema.extend({
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // If any password field is filled, all should be filled and match
  const hasPasswordFields = data.currentPassword || data.newPassword || data.confirmPassword
  
  if (!hasPasswordFields) return true
  
  if (!data.currentPassword) return false
  if (!data.newPassword) return false
  if (!data.confirmPassword) return false
  
  return data.newPassword === data.confirmPassword
}, {
  message: "Password fields must all be filled and new passwords must match",
  path: ['confirmPassword'],
})

export type ProfileInfo = z.infer<typeof profileInfoSchema>
export type SocialLinks = z.infer<typeof socialLinksSchema>
export type PasswordChange = z.infer<typeof passwordChangeSchema>
export type ProfileData = z.infer<typeof profileSchema>
export type ProfileWithPassword = z.infer<typeof profileWithPasswordSchema>