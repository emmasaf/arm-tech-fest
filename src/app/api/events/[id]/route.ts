import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { 
        id: params.id,
        status: 'PUBLISHED',
        isPublished: true
      },
      include: {
        category: true,
        organizer: {
          select: { 
            id: true, 
            name: true, 
            organization: true,
            bio: true,
            website: true,
            socialLinks: true
          }
        },
        _count: {
          select: { tickets: true }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const formattedFestival = {
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
      zipCode: event.zipCode,
      country: event.country,
      venueType: event.venueType,
      price: event.price,
      currency: event.currency,
      capacity: event.capacity,
      expectedAttendance: event.expectedAttendance,
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
        organization: event.organizer.organization,
        bio: event.organizer.bio,
        website: event.organizer.website,
        socialLinks: event.organizer.socialLinks
      },
      ticketsSold: event._count.tickets,
      availableTickets: Math.max(0, event.capacity - event._count.tickets),
      createdAt: event.createdAt.toISOString(),
      publishedAt: event.publishedAt?.toISOString()
    }

    return NextResponse.json(formattedFestival)
  } catch (error) {
    console.error('Event detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check permissions
    const canEdit = event.organizerId === session.user.id || 
                   ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(session.user.role)

    if (!canEdit) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await request.json()

    const updatedFestival = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        category: true,
        organizer: {
          select: { id: true, name: true, organization: true }
        }
      }
    })

    return NextResponse.json(updatedFestival)
  } catch (error) {
    console.error('Update event error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check permissions
    const canDelete = event.organizerId === session.user.id || 
                     ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)

    if (!canDelete) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check if event has tickets sold
    const ticketCount = await prisma.ticket.count({
      where: { eventId: params.id }
    })

    if (ticketCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete event with sold tickets. Cancel it instead.' 
      }, { status: 400 })
    }

    await prisma.event.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}