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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignedToMe = searchParams.get('assignedToMe') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')

    const skip = (page - 1) * limit

    // Build where clause based on user role
    const where: any = {}

    // Users can only see their own tickets
    if (session.user.role === 'USER') {
      where.userId = session.user.id
    }

    // Support staff can see tickets assigned to them or all open tickets
    if (session.user.role === 'SUPPORT') {
      if (assignedToMe) {
        where.assignedTo = session.user.id
      }
      // Otherwise, show all tickets for support staff
    }

    // Apply filters
    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    const [tickets, totalCount] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          assignee: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.supportTicket.count({ where })
    ])

    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      category: ticket.category,
      user: {
        id: ticket.user.id,
        name: ticket.user.name,
        email: ticket.user.email
      },
      assignee: ticket.assignee ? {
        id: ticket.assignee.id,
        name: ticket.assignee.name,
        email: ticket.assignee.email
      } : null,
      resolution: ticket.resolution,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      closedAt: ticket.closedAt?.toISOString()
    }))

    const response = {
      tickets: formattedTickets,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Support tickets API error:', error)
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

    const data = await request.json()
    
    const ticket = await prisma.supportTicket.create({
      data: {
        subject: data.subject,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        category: data.category,
        userId: session.user.id,
        status: 'OPEN'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    const formattedTicket = {
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      category: ticket.category,
      user: {
        id: ticket.user.id,
        name: ticket.user.name,
        email: ticket.user.email
      },
      assignee: null,
      resolution: ticket.resolution,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      closedAt: ticket.closedAt?.toISOString()
    }

    return NextResponse.json(formattedTicket, { status: 201 })
  } catch (error) {
    console.error('Create support ticket error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}