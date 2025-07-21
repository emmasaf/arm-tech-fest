'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Headphones, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Users, 
  Ticket,
  Mail,
  Phone,
  Filter
} from 'lucide-react'

export default function SupportDashboard() {
  const supportTickets = [
    {
      id: 'ST-001',
      title: 'Unable to access purchased tickets',
      user: 'john.doe@email.com',
      priority: 'high',
      status: 'open',
      createdAt: '2 hours ago',
      category: 'Technical Issue',
      lastUpdate: '1 hour ago'
    },
    {
      id: 'ST-002',
      title: 'Refund request for cancelled event',
      user: 'jane.smith@email.com',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '5 hours ago',
      category: 'Billing',
      lastUpdate: '30 minutes ago'
    },
    {
      id: 'ST-003',
      title: 'Event information incorrect',
      user: 'organizer@events.com',
      priority: 'low',
      status: 'open',
      createdAt: '1 day ago',
      category: 'General Inquiry',
      lastUpdate: '1 day ago'
    },
    {
      id: 'ST-004',
      title: 'Account locked after multiple login attempts',
      user: 'user123@domain.com',
      priority: 'urgent',
      status: 'open',
      createdAt: '30 minutes ago',
      category: 'Account Access',
      lastUpdate: '30 minutes ago'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive'
      case 'in_progress': return 'secondary'
      case 'resolved': return 'default'
      case 'closed': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up">
            Support Center
          </h1>
          <p className="text-gray-600 mt-2 animate-fade-in-up scroll-delay-200">
            Manage customer support tickets and inquiries
          </p>
        </div>
        <Button className="hover-glow animate-fade-in-up scroll-delay-300">
          <Filter className="h-4 w-4 mr-2" />
          Filter Tickets
        </Button>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="animate-fade-in-up scroll-delay-400 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-3xl font-bold text-red-600">42</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-500 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-3xl font-bold text-green-600">18</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-600 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-blue-600">2.3h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-700 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Users Helped</p>
                <p className="text-3xl font-bold text-purple-600">156</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets Queue */}
      <Card className="animate-fade-in-up scroll-delay-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Support Tickets Queue
          </CardTitle>
          <CardDescription>Manage customer support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportTickets.map((ticket, index) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover-lift" style={{ animationDelay: `${900 + index * 100}ms` }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {ticket.id}
                      </Badge>
                      <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                        {ticket.priority}
                      </Badge>
                      <Badge variant={getStatusColor(ticket.status)} className="text-xs">
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {ticket.category}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{ticket.title}</h4>
                    <div className="text-sm text-gray-600">
                      <p>User: {ticket.user}</p>
                      <p>Created: {ticket.createdAt} • Last updated: {ticket.lastUpdate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="hover-glow">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                  <Button size="sm" variant="outline" className="hover-lift">
                    <Mail className="h-4 w-4 mr-2" />
                    Email User
                  </Button>
                  <Button size="sm" variant="outline" className="hover-lift">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up scroll-delay-1300">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Customer Satisfaction</span>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">4.8/5</div>
                <div className="text-xs text-gray-600">+0.2 this month</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">First Response Time</span>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">1.2h</div>
                <div className="text-xs text-gray-600">-0.5h improvement</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resolution Rate</span>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">94%</div>
                <div className="text-xs text-gray-600">Same day resolution</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-1400">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Resolved: Ticket refund issue</p>
                  <p className="text-gray-600">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Responded to: Login problems</p>
                  <p className="text-gray-600">25 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Mail className="h-4 w-4 text-purple-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Escalated: Complex billing inquiry</p>
                  <p className="text-gray-600">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up scroll-delay-1500">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">High Priority Tickets</div>
              <div className="text-sm text-gray-600">View urgent support requests</div>
            </div>
          </Button>
          
          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <Users className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">User Lookup</div>
              <div className="text-sm text-gray-600">Search and assist users</div>
            </div>
          </Button>

          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <Ticket className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Ticket Analytics</div>
              <div className="text-sm text-gray-600">View support performance data</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}