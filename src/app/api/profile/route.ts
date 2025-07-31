import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Profile update schema
const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  organization: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    github: z.string().optional(),
  }).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
})

// GET - Get user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log(session,'sessionsession')
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        organization: true,
        website: true,
        socialLinks: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        lastLoginAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = profileUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword, email, ...profileData } = validationResult.data

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        password: true,
      }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Handle email change
    if (email && email !== currentUser.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }
    }

    // Handle password change
    let hashedPassword: string | undefined
    if (currentPassword && newPassword) {
      if (!currentUser.password) {
        return NextResponse.json(
          { error: 'Current password not set' },
          { status: 400 }
        )
      }

      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      hashedPassword = await bcrypt.hash(newPassword, 12)
    }

    // Prepare update data
    const updateData: any = {
      ...profileData,
      updatedAt: new Date(),
    }

    if (email) {
      updateData.email = email
      updateData.emailVerified = null // Reset email verification if email changes
    }

    if (hashedPassword) {
      updateData.password = hashedPassword
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        organization: true,
        website: true,
        socialLinks: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        lastLoginAt: true,
      }
    })

    // Log the profile update action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_PROFILE',
        entity: 'USER',
        entityId: session.user.id,
        changes: updateData,
        metadata: {
          fieldsUpdated: Object.keys(updateData),
          emailChanged: !!email,
          passwordChanged: !!hashedPassword,
        },
      }
    })

    return NextResponse.json({ 
      user: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}