'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  FileText, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Users,
  Eye,
  Ban
} from 'lucide-react'

export default function ModeratorDashboard() {
  const pendingReviews = [
    {
      id: 1,
      type: 'event',
      title: 'Electronic Dance Event 2024',
      submittedBy: 'DJ Events LLC',
      submittedAt: '2 hours ago',
      priority: 'high',
      location: 'Miami Beach, FL'
    },
    {
      id: 2,
      type: 'event',
      title: 'Community Food Fair',
      submittedBy: 'Local Food Network',
      submittedAt: '4 hours ago',
      priority: 'medium',
      location: 'Austin, TX'
    },
    {
      id: 3,
      type: 'report',
      title: 'Inappropriate Content Report',
      submittedBy: 'user@example.com',
      submittedAt: '1 day ago',
      priority: 'urgent',
      details: 'Offensive language in event description'
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up">
          Moderation Center
        </h1>
        <p className="text-gray-600 mt-2 animate-fade-in-up scroll-delay-200">
          Review and moderate platform content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="animate-fade-in-up scroll-delay-300 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-red-600">23</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-400 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-3xl font-bold text-green-600">15</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-500 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reported Content</p>
                <p className="text-3xl font-bold text-yellow-600">8</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-600 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-3xl font-bold text-blue-600">247</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Queue */}
      <Card className="animate-fade-in-up scroll-delay-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Priority Review Queue
          </CardTitle>
          <CardDescription>Items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingReviews.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 hover-lift" style={{ animationDelay: `${800 + index * 100}ms` }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant={item.type === 'event' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {item.type === 'event' ? 'Event Request' : 'Content Report'}
                      </Badge>
                      <Badge 
                        variant={
                          item.priority === 'urgent' ? 'destructive' : 
                          item.priority === 'high' ? 'destructive' : 
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Submitted by: {item.submittedBy}</p>
                      {item.location && <p>Location: {item.location}</p>}
                      {item.details && <p>Details: {item.details}</p>}
                      <p>Submitted: {item.submittedAt}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="hover-glow">
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="hover-lift">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="hover-lift">
                    <Ban className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Moderation Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up scroll-delay-1100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Event Reviews</span>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">18</div>
                <div className="text-xs text-gray-600">+2 from yesterday</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Content Reports</span>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-600">5</div>
                <div className="text-xs text-gray-600">-1 from yesterday</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">User Actions</span>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">3</div>
                <div className="text-xs text-gray-600">Suspensions/warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-1200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Approved: Jazz in the Park Event</p>
                  <p className="text-gray-600">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <Ban className="h-4 w-4 text-red-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Rejected: Unsafe venue conditions</p>
                  <p className="text-gray-600">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Warning issued to user for spam</p>
                  <p className="text-gray-600">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up scroll-delay-1300">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <FileText className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Event Requests</div>
              <div className="text-sm text-gray-600">Review pending event submissions</div>
            </div>
          </Button>
          
          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <MessageCircle className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Content Reports</div>
              <div className="text-sm text-gray-600">Handle reported content</div>
            </div>
          </Button>

          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <Users className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">User Management</div>
              <div className="text-sm text-gray-600">Manage user accounts and permissions</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}