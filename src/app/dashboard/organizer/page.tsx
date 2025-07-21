'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Ticket, 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  Plus,
  BarChart3
} from 'lucide-react'

export default function OrganizerDashboard() {
  const events = [
    {
      id: 1,
      name: 'Summer Music Event 2024',
      status: 'Published',
      startDate: '2024-08-15',
      ticketsSold: 847,
      ticketsTotal: 1200,
      revenue: '$21,175',
      location: 'Central Park, NYC'
    },
    {
      id: 2,
      name: 'Autumn Art Fair',
      status: 'Draft',
      startDate: '2024-10-20',
      ticketsSold: 0,
      ticketsTotal: 800,
      revenue: '$0',
      location: 'Art Museum Plaza'
    },
    {
      id: 3,
      name: 'Winter Food Event',
      status: 'Under Review',
      startDate: '2024-12-10',
      ticketsSold: 0,
      ticketsTotal: 600,
      revenue: '$0',
      location: 'Downtown Square'
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up">
            Event Management
          </h1>
          <p className="text-gray-600 mt-2 animate-fade-in-up scroll-delay-200">
            Manage your events and track performance
          </p>
        </div>
        <Button className="hover-glow animate-fade-in-up scroll-delay-300">
          <Plus className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="animate-fade-in-up scroll-delay-400 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-500 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
                <p className="text-3xl font-bold text-gray-900">847</p>
              </div>
              <Ticket className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-600 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$21,175</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-700 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">4.8</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card className="animate-fade-in-up scroll-delay-800">
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>Manage and track your event events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id} className="border rounded-lg p-6 hover-lift" style={{ animationDelay: `${900 + index * 100}ms` }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      event.status === 'Published' ? 'default' : 
                      event.status === 'Under Review' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {event.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Sales</p>
                    <div className="mt-1">
                      <div className="flex justify-between text-sm">
                        <span>{event.ticketsSold} sold</span>
                        <span>{event.ticketsTotal} total</span>
                      </div>
                      <Progress 
                        value={(event.ticketsSold / event.ticketsTotal) * 100} 
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{event.revenue}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Capacity</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round((event.ticketsSold / event.ticketsTotal) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="hover-lift">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="hover-lift">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  {event.status === 'Draft' && (
                    <Button size="sm" className="hover-glow">
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="animate-fade-in-up scroll-delay-1200">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">25 tickets sold for Summer Music Event</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Winter Food Event submitted for review</p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New review posted for Summer Music Event (5 stars)</p>
                <p className="text-xs text-gray-600">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}