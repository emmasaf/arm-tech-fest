import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEventRequestNotification } from '@/lib/email'
import { eventRequestSchema, eventRequestQuerySchema } from '@/lib/validations'
import { z } from 'zod'

// POST - Create new event request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = eventRequestSchema.parse(body)

    // Convert dates to proper DateTime objects
    const startDate = new Date(validatedData.startDate)
    const endDate = new Date(validatedData.endDate)
    
    // Validate dates
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    // if (startDate < thirtyDaysFromNow) {
    //   return NextResponse.json(
    //     { error: 'Event must be at least 30 days from submission date' },
    //     { status: 400 }
    //   )
    // }

    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Parse ticket price if provided
    let ticketPrice = null
    if (!validatedData.freeEvent && validatedData.ticketPrice) {
      ticketPrice = parseFloat(validatedData.ticketPrice)
      if (isNaN(ticketPrice) || ticketPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid ticket price' },
          { status: 400 }
        )
      }
    }

    // Create the event request
    const eventRequest = await prisma.eventRequest.create({
      data: {
        organizerName: validatedData.organizerName,
        organizerEmail: validatedData.organizerEmail,
        organizerPhone: validatedData.organizerPhone,
        organizationName: validatedData.organizationName,
        organizationWebsite: validatedData.organizationWebsite || null,
        organizationDescription: validatedData.organizationDescription,
        eventName: validatedData.eventName,
        eventDescription: validatedData.eventDescription,
        category: validatedData.category,
        startDate,
        endDate,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        venueName: validatedData.venueName,
        venueAddress: validatedData.venueAddress,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode || null,
        country: validatedData.country,
        venueType: validatedData.venueType,
        expectedAttendance: validatedData.expectedAttendance,
        ticketPrice,
        isFree: validatedData.freeEvent,
        ageRestriction: validatedData.ageRestriction || null,
        isAccessible: validatedData.accessibility,
        hasParking: validatedData.parking,
        hasFoodVendors: validatedData.foodVendors,
        servesAlcohol: validatedData.alcoholServed,
        websiteUrl: validatedData.websiteUrl || null,
        socialMediaLinks: validatedData.socialMediaLinks || null,
        previousEvents: validatedData.previousEvents || null,
        marketingPlan: validatedData.marketingPlan || null,
        specialRequirements: validatedData.specialRequirements || null,
        insuranceInfo: validatedData.insuranceInfo || null,
        hasPermits: validatedData.permitsObtained,
        emergencyPlan: validatedData.emergencyPlan || null,
        status: 'PENDING',
      },
    })

    // Send email notification to admins
    try {
      await sendEventRequestNotification(eventRequest)
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Event request submitted successfully',
      data: {
        id: eventRequest.id,
        eventName: eventRequest.eventName,
        status: eventRequest.status,
        submittedAt: eventRequest.submittedAt,
      }
    })

  } catch (error) {
    console.error('Error creating event request:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve event requests (with pagination and filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryData = eventRequestQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      status: searchParams.get('status'),
      search: searchParams.get('search'),
    })
    
    const skip = (queryData.page - 1) * queryData.limit

    // Build where clause
    const where: any = {}
    if (queryData.status) {
      where.status = queryData.status
    }
    if (queryData.search) {

      where.OR = [
        { eventName: { contains: queryData.search, mode: 'insensitive' } },
        { organizerName: { contains: queryData.search, mode: 'insensitive' } },
        { organizationName: { contains: queryData.search, mode: 'insensitive' } },
      ]
    }

    // Get event requests with pagination
    const [eventRequests, totalCount] = await Promise.all([
      prisma.eventRequest.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip,
        take: queryData.limit,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.eventRequest.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / queryData.limit)

    return NextResponse.json({
      success: true,
      data: eventRequests,
      pagination: {
        page: queryData.page,
        limit: queryData.limit,
        totalCount,
        totalPages,
        hasNext: queryData.page < totalPages,
        hasPrev: queryData.page > 1,
      }
    })

  } catch (error) {
    console.error('Error fetching event requests:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error
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