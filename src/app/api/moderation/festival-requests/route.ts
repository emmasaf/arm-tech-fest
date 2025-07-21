import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only moderators, admins, and super admins can access this
    if (!['MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')

    const skip = (page - 1) * limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    const [requests, totalCount] = await Promise.all([
      prisma.festivalRequest.findMany({
        where,
        include: {
          reviewer: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: [
          { status: 'asc' }, // Pending first
          { submittedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.festivalRequest.count({ where })
    ])

    const formattedRequests = requests.map(request => ({
      id: request.id,
      organizerName: request.organizerName,
      organizerEmail: request.organizerEmail,
      organizerPhone: request.organizerPhone,
      organizationName: request.organizationName,
      organizationWebsite: request.organizationWebsite,
      organizationDescription: request.organizationDescription,
      eventName: request.eventName,
      eventDescription: request.eventDescription,
      category: request.category,
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
      startTime: request.startTime,
      endTime: request.endTime,
      venueName: request.venueName,
      venueAddress: request.venueAddress,
      city: request.city,
      state: request.state,
      zipCode: request.zipCode,
      country: request.country,
      venueType: request.venueType,
      expectedAttendance: request.expectedAttendance,
      ticketPrice: request.ticketPrice,
      isFree: request.isFree,
      ageRestriction: request.ageRestriction,
      isAccessible: request.isAccessible,
      hasParking: request.hasParking,
      hasFoodVendors: request.hasFoodVendors,
      servesAlcohol: request.servesAlcohol,
      websiteUrl: request.websiteUrl,
      socialMediaLinks: request.socialMediaLinks,
      previousEvents: request.previousEvents,
      marketingPlan: request.marketingPlan,
      specialRequirements: request.specialRequirements,
      insuranceInfo: request.insuranceInfo,
      hasPermits: request.hasPermits,
      emergencyPlan: request.emergencyPlan,
      status: request.status,
      reviewNotes: request.reviewNotes,
      rejectionReason: request.rejectionReason,
      reviewer: request.reviewer ? {
        id: request.reviewer.id,
        name: request.reviewer.name,
        email: request.reviewer.email
      } : null,
      submittedAt: request.submittedAt.toISOString(),
      reviewedAt: request.reviewedAt?.toISOString(),
      updatedAt: request.updatedAt.toISOString()
    }))

    const response = {
      requests: formattedRequests,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Event requests API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}