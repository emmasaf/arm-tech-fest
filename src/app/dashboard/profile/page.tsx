"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, Mail, Phone, MapPin, Building, Globe, Lock, Calendar, Shield } from 'lucide-react'
import { useProfile, useUpdateProfile } from '@/hooks/api/use-profile'
import { profileWithPasswordSchema, type ProfileWithPassword } from '@/lib/validations/profile'
import { useTranslations } from '@/contexts/translation-context'
import { cn } from '@/lib/utils'
import React from 'react'

export default function ProfilePage() {
  const t = useTranslations()
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const { data: profileData, isLoading, error } = useProfile()
  const updateProfile = useUpdateProfile()

  const form = useForm<ProfileWithPassword>({
    resolver: zodResolver(profileWithPasswordSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      organization: '',
      website: '',
      socialLinks: {
        twitter: '',
        linkedin: '',
        facebook: '',
        instagram: '',
        github: '',
      },
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { handleSubmit, formState: { errors, isSubmitting, isDirty }, reset, watch } = form

  // Update form when profile data loads
  React.useEffect(() => {
    if (profileData?.user) {
      const user = profileData.user
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        organization: user.organization || '',
        website: user.website || '',
        socialLinks: {
          twitter: user.socialLinks?.twitter || '',
          linkedin: user.socialLinks?.linkedin || '',
          facebook: user.socialLinks?.facebook || '',
          instagram: user.socialLinks?.instagram || '',
          github: user.socialLinks?.github || '',
        },
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }, [profileData, reset])

  const onSubmit = async (data: ProfileWithPassword) => {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        bio: data.bio || undefined,
        location: data.location || undefined,
        organization: data.organization || undefined,
        website: data.website || undefined,
        socialLinks: {
          twitter: data.socialLinks?.twitter || undefined,
          linkedin: data.socialLinks?.linkedin || undefined,
          facebook: data.socialLinks?.facebook || undefined,
          instagram: data.socialLinks?.instagram || undefined,
          github: data.socialLinks?.github || undefined,
        },
      }

      // Add password fields if they're being changed
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      await updateProfile.mutateAsync(updateData)
      
      // Reset password fields after successful update
      form.setValue('currentPassword', '')
      form.setValue('newPassword', '')
      form.setValue('confirmPassword', '')
      setShowPasswordFields(false)
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !profileData?.user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">Failed to load profile data</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const user = profileData.user

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('navigation.profile')}</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-purple-600 text-white text-xl">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{user.name || 'No name set'}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {user.role}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  {user.lastLoginAt && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Last login {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className={cn(
                      user.emailVerified ? "text-green-600" : "text-orange-600"
                    )}>
                      Email {user.emailVerified ? 'verified' : 'not verified'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your basic profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          {...form.register('name')}
                          className="pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          {...form.register('email')}
                          className="pl-10"
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          {...form.register('phone')}
                          className="pl-10"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="location"
                          {...form.register('location')}
                          className="pl-10"
                          placeholder="City, Country"
                        />
                      </div>
                      {errors.location && (
                        <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="organization"
                          {...form.register('organization')}
                          className="pl-10"
                          placeholder="Company or organization"
                        />
                      </div>
                      {errors.organization && (
                        <p className="text-sm text-red-600 mt-1">{errors.organization.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          {...form.register('website')}
                          className="pl-10"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      {errors.website && (
                        <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...form.register('bio')}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                    {errors.bio && (
                      <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social media profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        {...form.register('socialLinks.twitter')}
                        placeholder="https://twitter.com/username or @username"
                      />
                      {errors.socialLinks?.twitter && (
                        <p className="text-sm text-red-600 mt-1">{errors.socialLinks.twitter.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        {...form.register('socialLinks.linkedin')}
                        placeholder="https://linkedin.com/in/username"
                      />
                      {errors.socialLinks?.linkedin && (
                        <p className="text-sm text-red-600 mt-1">{errors.socialLinks.linkedin.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        {...form.register('socialLinks.github')}
                        placeholder="https://github.com/username"
                      />
                      {errors.socialLinks?.github && (
                        <p className="text-sm text-red-600 mt-1">{errors.socialLinks.github.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        {...form.register('socialLinks.instagram')}
                        placeholder="https://instagram.com/username or @username"
                      />
                      {errors.socialLinks?.instagram && (
                        <p className="text-sm text-red-600 mt-1">{errors.socialLinks.instagram.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showPasswordFields ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordFields(true)}
                    >
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...form.register('currentPassword')}
                          placeholder="Enter current password"
                        />
                        {errors.currentPassword && (
                          <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            {...form.register('newPassword')}
                            placeholder="Enter new password"
                          />
                          {errors.newPassword && (
                            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            {...form.register('confirmPassword')}
                            placeholder="Confirm new password"
                          />
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowPasswordFields(false)
                            form.setValue('currentPassword', '')
                            form.setValue('newPassword', '')
                            form.setValue('confirmPassword', '')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset()
                    setShowPasswordFields(false)
                  }}
                  disabled={isSubmitting || !isDirty}
                >
                  Reset Changes
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}