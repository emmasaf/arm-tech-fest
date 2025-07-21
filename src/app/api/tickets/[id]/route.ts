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
    const ticketId = params.id

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 })
    }

    // Find ticket by ticketId (not database ID)
    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { id: ticketId },       // Database ID
          { ticketId: ticketId }  // Ticket ID
        ]
      },
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
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json(ticket)

  } catch (error) {
    console.error('Get ticket error:', error)
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

    const ticketId = params.id
    const data = await request.json()

    // Find the ticket
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketId: ticketId }
        ]
      }
    })

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Check permissions - only ticket owner or admin can update
    if (existingTicket.buyerId !== session.user.id && 
        !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Update ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id: existingTicket.id },
      data: {
        ...data,
        updatedAt: new Date()
      },
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
      }
    })

    return NextResponse.json(updatedTicket)

  } catch (error) {
    console.error('Update ticket error:', error)
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

    // Only admins can delete tickets (cancel would be better than delete)
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const ticketId = params.id

    // Find the ticket
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketId: ticketId }
        ]
      }
    })

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Instead of deleting, we should cancel the ticket
    const cancelledTicket = await prisma.ticket.update({
      where: { id: existingTicket.id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: 'Ticket cancelled successfully',
      ticket: cancelledTicket 
    })

  } catch (error) {
    console.error('Cancel ticket error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}