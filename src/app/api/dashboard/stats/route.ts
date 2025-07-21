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

    const user = session.user
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || user.role

    let stats = {}

    switch (role) {
      case 'SUPER_ADMIN':
        stats = await getSuperAdminStats()
        break
      case 'MODERATOR':
        stats = await getModeratorStats()
        break
      case 'ORGANIZER':
        stats = await getOrganizerStats(user.id)
        break
      case 'SUPPORT':
        stats = await getSupportStats(user.id)
        break
      case 'USER':
      default:
        stats = await getUserStats(user.id)
        break
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

async function getSuperAdminStats() {
  const [
    totalUsers,
    activeFestivals,
    totalTickets,
    pendingRequests,
    supportTickets
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count({ where: { status: 'PUBLISHED' } }),
    prisma.ticket.count(),
    prisma.eventRequest.count({ where: { status: 'PENDING' } }),
    prisma.supportTicket.count({ where: { status: 'OPEN' } })
  ])

  const totalRevenue = await prisma.ticket.aggregate({
    _sum: { price: true }
  })

  const recentUsers = await prisma.user.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  })

  return {
    title: 'Super Admin Dashboard',
    description: 'System overview and administration',
    stats: [
      { title: 'Total Users', value: totalUsers.toLocaleString(), icon: 'Users', color: 'text-blue-600' },
      { title: 'Active Events', value: activeFestivals.toString(), icon: 'Calendar', color: 'text-green-600' },
      { title: 'Tickets Sold', value: totalTickets.toLocaleString(), icon: 'Ticket', color: 'text-purple-600' },
      { title: 'Revenue', value: `$${(totalRevenue._sum.price || 0).toLocaleString()}`, icon: 'TrendingUp', color: 'text-orange-600' }
    ],
    alerts: [
      ...(pendingRequests > 0 ? [{
        type: 'warning' as const,
        message: `${pendingRequests} event requests pending approval`
      }] : []),
      ...(supportTickets > 0 ? [{
        type: 'info' as const,
        message: `${supportTickets} support tickets need attention`
      }] : []),
      ...(recentUsers > 10 ? [{
        type: 'success' as const,
        message: `${recentUsers} new users joined this month`
      }] : [])
    ]
  }
}

async function getModeratorStats() {
  const [
    pendingReviews,
    approvedToday,
    reportedContent,
    activeFestivals
  ] = await Promise.all([
    prisma.eventRequest.count({ where: { status: 'PENDING' } }),
    prisma.eventRequest.count({
      where: {
        status: 'APPROVED',
        reviewedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    prisma.eventRequest.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.event.count({ where: { status: 'PUBLISHED' } })
  ])

  const urgentReviews = await prisma.eventRequest.count({
    where: {
      status: 'PENDING',
      submittedAt: { lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  })

  return {
    title: 'Moderator Dashboard',
    description: 'Content moderation and platform oversight',
    stats: [
      { title: 'Pending Reviews', value: pendingReviews.toString(), icon: 'Clock', color: 'text-yellow-600' },
      { title: 'Approved Today', value: approvedToday.toString(), icon: 'CheckCircle', color: 'text-green-600' },
      { title: 'Under Review', value: reportedContent.toString(), icon: 'AlertTriangle', color: 'text-red-600' },
      { title: 'Active Events', value: activeFestivals.toString(), icon: 'Calendar', color: 'text-blue-600' }
    ],
    alerts: [
      ...(urgentReviews > 0 ? [{
        type: 'urgent' as const,
        message: `${urgentReviews} event requests require immediate review`
      }] : []),
      ...(reportedContent > 0 ? [{
        type: 'warning' as const,
        message: `${reportedContent} items need investigation`
      }] : [])
    ]
  }
}

async function getOrganizerStats(userId: string) {
  const [
    myFestivals,
    totalTickets,
    upcomingEvents
  ] = await Promise.all([
    prisma.event.count({ where: { organizerId: userId } }),
    prisma.ticket.count({
      where: { event: { organizerId: userId } }
    }),
    prisma.event.count({
      where: {
        organizerId: userId,
        startDate: { gte: new Date() },
        status: 'PUBLISHED'
      }
    })
  ])

  const revenue = await prisma.ticket.aggregate({
    _sum: { price: true },
    where: { event: { organizerId: userId } }
  })

  const recentTickets = await prisma.ticket.count({
    where: {
      event: { organizerId: userId },
      purchasedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }
  })

  return {
    title: 'Organizer Dashboard',
    description: 'Manage your events and events',
    stats: [
      { title: 'My Events', value: myFestivals.toString(), icon: 'Calendar', color: 'text-purple-600' },
      { title: 'Tickets Sold', value: totalTickets.toLocaleString(), icon: 'Ticket', color: 'text-green-600' },
      { title: 'Revenue', value: `$${(revenue._sum.price || 0).toLocaleString()}`, icon: 'TrendingUp', color: 'text-orange-600' },
      { title: 'Upcoming Events', value: upcomingEvents.toString(), icon: 'Clock', color: 'text-blue-600' }
    ],
    alerts: [
      ...(upcomingEvents > 0 ? [{
        type: 'info' as const,
        message: `${upcomingEvents} upcoming events to prepare for`
      }] : []),
      ...(recentTickets > 0 ? [{
        type: 'success' as const,
        message: `${recentTickets} new tickets sold today`
      }] : [])
    ]
  }
}

async function getSupportStats(userId: string) {
  const [
    openTickets,
    resolvedToday,
    assignedToMe,
    totalUsers
  ] = await Promise.all([
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    prisma.supportTicket.count({
      where: {
        status: 'RESOLVED',
        updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    prisma.supportTicket.count({
      where: { assignedTo: userId, status: { in: ['OPEN', 'IN_PROGRESS'] } }
    }),
    prisma.user.count()
  ])

  const highPriorityTickets = await prisma.supportTicket.count({
    where: { priority: 'HIGH', status: 'OPEN' }
  })

  const avgResponseTime = await prisma.supportTicket.findMany({
    where: { status: 'RESOLVED', assignedTo: userId },
    select: { createdAt: true, updatedAt: true }
  })

  const avgHours = avgResponseTime.length > 0 
    ? avgResponseTime.reduce((acc, ticket) => {
        const diff = ticket.updatedAt.getTime() - ticket.createdAt.getTime()
        return acc + (diff / (1000 * 60 * 60))
      }, 0) / avgResponseTime.length
    : 0

  return {
    title: 'Support Dashboard',
    description: 'Customer support and assistance',
    stats: [
      { title: 'Open Tickets', value: openTickets.toString(), icon: 'AlertTriangle', color: 'text-red-600' },
      { title: 'Resolved Today', value: resolvedToday.toString(), icon: 'CheckCircle', color: 'text-green-600' },
      { title: 'Avg Response', value: `${avgHours.toFixed(1)}h`, icon: 'Clock', color: 'text-blue-600' },
      { title: 'Users Helped', value: totalUsers.toString(), icon: 'Users', color: 'text-purple-600' }
    ],
    alerts: [
      ...(highPriorityTickets > 0 ? [{
        type: 'urgent' as const,
        message: `${highPriorityTickets} high-priority tickets need immediate attention`
      }] : []),
      ...(assignedToMe > 5 ? [{
        type: 'warning' as const,
        message: `${assignedToMe} tickets assigned to you`
      }] : [])
    ]
  }
}

async function getUserStats(userId: string) {
  const [
    myTickets,
    attendedFestivals,
    upcomingEvents
  ] = await Promise.all([
    prisma.ticket.count({ where: { buyerId: userId } }),
    prisma.ticket.count({
      where: {
        buyerId: userId,
        event: { endDate: { lt: new Date() } }
      }
    }),
    prisma.ticket.count({
      where: {
        buyerId: userId,
        event: { startDate: { gte: new Date() } }
      }
    })
  ])

  const totalSpent = await prisma.ticket.aggregate({
    _sum: { price: true },
    where: { buyerId: userId }
  })

  const nextEvent = await prisma.ticket.findFirst({
    where: {
      buyerId: userId,
      event: { startDate: { gte: new Date() } }
    },
    include: { event: true },
    orderBy: { event: { startDate: 'asc' } }
  })

  return {
    title: 'My Dashboard',
    description: 'Your event tickets and activity',
    stats: [
      { title: 'My Tickets', value: myTickets.toString(), icon: 'Ticket', color: 'text-purple-600' },
      { title: 'Events Attended', value: attendedFestivals.toString(), icon: 'Calendar', color: 'text-green-600' },
      { title: 'Upcoming Events', value: upcomingEvents.toString(), icon: 'Clock', color: 'text-blue-600' },
      { title: 'Total Spent', value: `$${(totalSpent._sum.price || 0).toLocaleString()}`, icon: 'TrendingUp', color: 'text-orange-600' }
    ],
    alerts: [
      ...(nextEvent ? [{
        type: 'info' as const,
        message: `Upcoming: ${nextEvent.event.name} in ${Math.ceil((nextEvent.event.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`
      }] : []),
      ...(upcomingEvents > 0 ? [{
        type: 'success' as const,
        message: `You have ${upcomingEvents} upcoming events`
      }] : [])
    ]
  }
}