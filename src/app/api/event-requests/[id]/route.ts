import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { eventRequestUpdateSchema } from '@/lib/validations'
import { sendEventRequestStatusEmail } from '@/lib/email'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - Get specific event request by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const eventRequest = await prisma.eventRequest.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    if (!eventRequest) {
      return NextResponse.json(
        { error: 'Event request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: eventRequest
    })

  } catch (error) {
    console.error('Error fetching event request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update event request status (approve/reject)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user has admin permissions
    if (!['MODERATOR', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { id } =await params
    const body = await request.json()
    const validatedData = eventRequestUpdateSchema.parse(body)

    const existingRequest = await prisma.eventRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Event request not found' },
        { status: 404 }
      )
    }

    // Validate rejection reason if status is REJECTED
    if (validatedData.status === 'REJECTED' && !validatedData.rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a request' },
        { status: 400 }
      )
    }


    // Verify the reviewer user exists or create if needed
    let reviewer = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    })

    if (!reviewer) {
      console.log('Reviewer user not found, creating:', session.user.id)
      // Create the user if they don't exist (this can happen with JWT sessions)
      try {
        reviewer = await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email || `user${session.user.id}@example.com`,
            name: session.user.name || 'Admin User',
            role: session.user.role || 'MODERATOR',
            hashedPassword: '', // Empty password for JWT-based users
          },
          select: { id: true }
        })
        console.log('Created reviewer user:', reviewer.id)
      } catch (createError) {
        console.error('Failed to create reviewer user:', createError)
        return NextResponse.json(
          { error: 'User authentication error. Please log in again.' },
          { status: 401 }
        )
      }
    }

    const updatedRequest = await prisma.eventRequest.update({
      where: { id },
      data: {
        status: validatedData.status,
        reviewNotes: validatedData.reviewNotes,
        rejectionReason: validatedData.rejectionReason,
        reviewedAt: new Date(),
        reviewerId: session.user.id,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // If approved, create the actual event and delete the request
    let createdEvent = null
    if (validatedData.status === 'APPROVED') {
      try {
        // Generate a unique slug
        const slug = updatedRequest.eventName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        
        // Find a suitable category ID
        const category = await prisma.category.findFirst({
          where: { 
            name: { 
              contains: updatedRequest.category, 
              mode: 'insensitive' 
            } 
          }
        })

        if (!category) {
          throw new Error(`Category not found for event creation: ${updatedRequest.category}`)
        }

        // Parse expected attendance to integer for capacity
        const capacity = parseInt(updatedRequest.expectedAttendance) || 100
        
        // Map venue type string to enum
        let venueTypeEnum: 'OUTDOOR' | 'INDOOR' | 'MIXED' | 'VIRTUAL' | 'HYBRID' = 'INDOOR'
        const venueTypeLower = updatedRequest.venueType.toLowerCase()
        console.log('Venue type from request:', updatedRequest.venueType, 'lowercase:', venueTypeLower)
        
        if (venueTypeLower === 'outdoor' || venueTypeLower.includes('outdoor')) venueTypeEnum = 'OUTDOOR'
        else if (venueTypeLower === 'mixed' || venueTypeLower.includes('mixed')) venueTypeEnum = 'MIXED'
        else if (venueTypeLower === 'virtual' || venueTypeLower.includes('virtual')) venueTypeEnum = 'VIRTUAL'
        else if (venueTypeLower === 'hybrid' || venueTypeLower.includes('hybrid')) venueTypeEnum = 'HYBRID'
        else if (venueTypeLower === 'indoor' || venueTypeLower.includes('indoor')) venueTypeEnum = 'INDOOR'
        
        console.log('Mapped venue type:', venueTypeEnum)
        
        // Create the event within a transaction
        const result = await prisma.$transaction(async (tx) => {
          // Create the event
          const event = await tx.event.create({
            data: {
              name: updatedRequest.eventName,
              slug: `${slug}-${Date.now()}`, // Ensure uniqueness
              description: updatedRequest.eventDescription,
              categoryId: category.id,
              startDate: updatedRequest.startDate,
              endDate: updatedRequest.endDate,
              startTime: updatedRequest.startTime,
              endTime: updatedRequest.endTime,
              venueName: updatedRequest.venueName,
              venueAddress: updatedRequest.venueAddress,
              city: updatedRequest.city,
              state: updatedRequest.state,
              zipCode: updatedRequest.zipCode,
              country: updatedRequest.country,
              venueType: venueTypeEnum,
              expectedAttendance: updatedRequest.expectedAttendance,
              price: updatedRequest.ticketPrice || 0,
              currency: 'USD',
              capacity: capacity,
              isFree: updatedRequest.isFree,
              ageRestriction: updatedRequest.ageRestriction,
              isAccessible: updatedRequest.isAccessible,
              hasParking: updatedRequest.hasParking,
              hasFoodVendors: updatedRequest.hasFoodVendors,
              servesAlcohol: updatedRequest.servesAlcohol,
              websiteUrl: updatedRequest.websiteUrl,
              socialMediaLinks: updatedRequest.socialMediaLinks,
              images: [], // Add empty array for required images field
              status: 'PUBLISHED',
              isPublished: true,
              publishedAt: new Date(),
              // Create or find the organizer user - for now use session user
              organizerId: reviewer.id, // Use the verified/created reviewer ID
            }
          })

          // Delete the event request since it's now approved and event is created
          // Temporarily comment out to isolate the issue
          // await tx.eventRequest.delete({
          //   where: { id: updatedRequest.id }
          // })

          return event
        })

        createdEvent = result
        
        // Send email notification to organizer about approval
        try {
          await sendEventRequestStatusEmail({
            ...updatedRequest,
            status: 'APPROVED',
            reviewNotes: validatedData.reviewNotes,
            reviewedAt: new Date(),
          })
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError)
        }

      } catch (eventCreationError) {
        console.error('Failed to create event after approval:', {
          category: updatedRequest.category,
          eventName: updatedRequest.eventName,
          error: eventCreationError
        })
        throw new Error('Failed to create event: ' + (eventCreationError instanceof Error ? eventCreationError.message : String(eventCreationError)))
      }
    } else if (validatedData.status === 'REJECTED') {
      // For rejected requests, just send email notification
      try {
        await sendEventRequestStatusEmail(updatedRequest)
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError)
      }
    }

    // Email notifications are now handled within the approval/rejection logic above


    const responseData = {
      success: true,
      message: validatedData.status === 'APPROVED' 
        ? 'Event request approved and event created successfully'
        : `Event request ${validatedData.status.toLowerCase()} successfully`,
      data: {
        eventRequest: validatedData.status === 'APPROVED' ? null : updatedRequest, // Request is deleted on approval
        createdEvent: createdEvent,
        action: validatedData.status
      }
    }
    
    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error in PATCH operation:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete event request (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user has super admin permissions
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { id } = await params

    const deletedRequest = await prisma.eventRequest.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Event request deleted successfully',
      data: deletedRequest
    })

  } catch (error) {
    console.error('Error deleting event request:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}