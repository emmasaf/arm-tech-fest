import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const featured = searchParams.get('featured') === 'true'
    const upcoming = searchParams.get('upcoming') === 'true'
    const organizerId = searchParams.get('organizerId')
    const statusFilter = searchParams.get('status') // 'all', 'ongoing', 'upcoming', 'finished'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
      isPublished: true
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { venueName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (upcoming) {
      where.startDate = { gte: new Date() }
    }

    if (organizerId) {
      where.organizerId = organizerId
    }

    // Add status filter
    const now = new Date()
    if (statusFilter && statusFilter !== 'all') {
      switch (statusFilter) {
        case 'upcoming':
          where.startDate = { gt: now }
          break
        case 'ongoing':
          where.AND = [
            { startDate: { lte: now } },
            { endDate: { gte: now } }
          ]
          break
        case 'finished':
          where.endDate = { lt: now }
          break
      }
    }

    // Get events with related data
    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          category: true,
          organizer: {
            select: { id: true, name: true, organization: true }
          },
          _count: {
            select: { tickets: true }
          }
        },
        orderBy: featured 
          ? [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
          : { startDate: 'asc' },
        skip,
        take: limit
      }),
      prisma.event.count({ where })
    ])

    // Format the response
    const formattedEvents = events.map(event => ({
      id: event.id,
      name: event.name,
      slug: event.slug,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      startTime: event.startTime,
      endTime: event.endTime,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      city: event.city,
      state: event.state,
      country: event.country,
      venueType: event.venueType,
      price: event.price,
      currency: event.currency,
      capacity: event.capacity,
      isFree: event.isFree,
      ageRestriction: event.ageRestriction,
      isAccessible: event.isAccessible,
      hasParking: event.hasParking,
      hasFoodVendors: event.hasFoodVendors,
      servesAlcohol: event.servesAlcohol,
      images: event.images,
      websiteUrl: event.websiteUrl,
      socialMediaLinks: event.socialMediaLinks,
      category: {
        id: event.category.id,
        name: event.category.name,
        slug: event.category.slug,
        color: event.category.color,
        icon: event.category.icon
      },
      organizer: {
        id: event.organizer.id,
        name: event.organizer.name,
        organization: event.organizer.organization
      },
      ticketsSold: event._count.tickets,
      availableTickets: Math.max(0, event.capacity - event._count.tickets),
      createdAt: event.createdAt.toISOString(),
      publishedAt: event.publishedAt?.toISOString()
    }))

    const response = {
      events: formattedEvents,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only organizers and admins can create events
    if (!['ORGANIZER', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await request.json()

    // Create slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const event = await prisma.event.create({
      data: {
        ...data,
        slug,
        organizerId: session.user.id,
        status: 'DRAFT',
        isPublished: false
      },
      include: {
        category: true,
        organizer: {
          select: { id: true, name: true, organization: true }
        }
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}