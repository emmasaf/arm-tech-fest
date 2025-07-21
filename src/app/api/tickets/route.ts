import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@/generated/prisma'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Generate QR code data for ticket
function generateQRCodeData(ticketId: string, eventId: string, buyerEmail: string): string {
  const timestamp = Date.now()
  const data = `${ticketId}:${eventId}:${buyerEmail}:${timestamp}`
  const hash = crypto.createHash('sha256').update(data + process.env.NEXTAUTH_SECRET).digest('hex')
  return `TICKET:${data}:${hash.substring(0, 8)}`
}

// Generate secure ticket ID
function generateTicketId(): string {
  return nanoid(12).toUpperCase()
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id
    const eventId = searchParams.get('eventId')

    let whereClause: any = {}

    // If requesting specific user's tickets
    if (userId) {
      whereClause.buyerId = userId
    }

    // If requesting tickets for specific event
    if (eventId) {
      whereClause.eventId = eventId
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        event: {
          include: {
            category: true,
            organizer: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        purchasedAt: 'desc'
      }
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Get tickets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    const { eventId, buyerName, buyerEmail, buyerPhone } = data

    if (!eventId || !buyerName || !buyerEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: eventId, buyerName, buyerEmail' 
      }, { status: 400 })
    }

    // Get event details and check availability
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: {
          where: { status: { not: 'CANCELLED' } }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if event is published and available for booking
    if (!event.isPublished || event.status !== 'PUBLISHED') {
      return NextResponse.json({ 
        error: 'Event is not available for booking' 
      }, { status: 400 })
    }

    // Check ticket availability
    const soldTickets = event.tickets.length
    if (soldTickets >= event.capacity) {
      return NextResponse.json({ 
        error: 'Event is sold out' 
      }, { status: 400 })
    }

    // Check if event date has passed
    const now = new Date()
    const eventDate = new Date(event.startDate)
    if (eventDate < now) {
      return NextResponse.json({ 
        error: 'Cannot purchase tickets for past events' 
      }, { status: 400 })
    }

    // Generate ticket details
    const ticketId = generateTicketId()
    const qrCode = nanoid(16)
    const qrCodeData = generateQRCodeData(ticketId, eventId, buyerEmail)

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketId,
        qrCode,
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone || null,
        price: event.price,
        currency: event.currency,
        status: 'ACTIVE',
        qrCodeData,
        eventId,
        buyerId: session?.user?.id || null,
      },
      include: {
        event: {
          include: {
            category: true,
            organizer: true
          }
        }
      }
    })

    // Update event available tickets count (if this field exists)
    // This would typically be a computed field, but we might need to track it
    
    return NextResponse.json({ 
      ticket,
      message: 'Ticket purchased successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Create ticket error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}