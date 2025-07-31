'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Ticket, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { useDashboardStats } from '@/hooks/api/useDashboardStats'
import { useSession } from 'next-auth/react'

// Icon mapping for dynamic rendering
const iconMap = {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3
}

export default function DashboardPage() {
  const { data: session, status } = useSession()

  // Fetch dashboard stats
  const { data: dashboardData, isLoading, error } = useDashboardStats()

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!session?.user || !dashboardData) {
    return null
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up">
          {dashboardData.title}
        </h1>
        <p className="text-gray-600 mt-2 animate-fade-in-up scroll-delay-200">
          {dashboardData.description}
        </p>
      </div>

      {/* Role Badge */}
      <div className="animate-fade-in-up scroll-delay-300">
        <Badge variant="outline" className="text-sm">
          Role: {session.user.role?.toLowerCase().replace('_', ' ')}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats?.map((stat: any, index: number) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || BarChart3
          
          return (
            <Card key={stat.title} className="animate-fade-in-up hover-lift" style={{ animationDelay: `${400 + index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alerts */}
      {dashboardData.alerts && dashboardData.alerts.length > 0 && (
        <div className="animate-fade-in-up scroll-delay-800">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {dashboardData.alerts.map((alert: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'urgent' 
                    ? 'bg-red-50 border-red-400 text-red-800'
                    : alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                    : alert.type === 'success'
                    ? 'bg-green-50 border-green-400 text-green-800'
                    : 'bg-blue-50 border-blue-400 text-blue-800'
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="animate-fade-in-up scroll-delay-1000">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {session.user.role === 'SUPER_ADMIN' && (
            <>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-sm text-gray-600">View and manage user accounts</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <BarChart3 className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">View Analytics</div>
                  <div className="text-sm text-gray-600">Platform performance metrics</div>
                </div>
              </Button>
            </>
          )}
          
          {session.user.role === 'ORGANIZER' && (
            <>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <Calendar className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Create Event</div>
                  <div className="text-sm text-gray-600">Add a new event event</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <BarChart3 className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">View Analytics</div>
                  <div className="text-sm text-gray-600">Event performance data</div>
                </div>
              </Button>
            </>
          )}

          {session.user.role === 'MODERATOR' && (
            <>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <CheckCircle className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Review Events</div>
                  <div className="text-sm text-gray-600">Approve pending event requests</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <AlertTriangle className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Content Moderation</div>
                  <div className="text-sm text-gray-600">Review reported content</div>
                </div>
              </Button>
            </>
          )}

          {session.user.role === 'SUPPORT' && (
            <>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <AlertTriangle className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Support Tickets</div>
                  <div className="text-sm text-gray-600">Handle customer inquiries</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Help Users</div>
                  <div className="text-sm text-gray-600">Provide customer assistance</div>
                </div>
              </Button>
            </>
          )}

          {(session.user.role === 'USER' || !session.user.role) && (
            <>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline" onClick={() => window.location.href = '/events'}>
                <Calendar className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Browse Events</div>
                  <div className="text-sm text-gray-600">Discover new events</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
                <Ticket className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">My Tickets</div>
                  <div className="text-sm text-gray-600">View purchased tickets</div>
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}