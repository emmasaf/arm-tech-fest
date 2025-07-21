'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database
} from 'lucide-react'

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up">
          System Administration
        </h1>
        <p className="text-gray-600 mt-2 animate-fade-in-up scroll-delay-200">
          Complete system oversight and management
        </p>
      </div>

      {/* System Health */}
      <Card className="animate-fade-in-up scroll-delay-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.1s</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">847</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15.4GB</div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card className="animate-fade-in-up scroll-delay-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12,847</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2,341</div>
              <div className="text-sm text-gray-600">Active Organizers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-gray-600">Moderators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">28</div>
              <div className="text-sm text-gray-600">Support Staff</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">156</div>
              <div className="text-sm text-gray-600">Suspended</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" className="hover-glow">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button size="sm" variant="outline" className="hover-lift">
              <Shield className="h-4 w-4 mr-2" />
              Role Management
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up scroll-delay-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Events</span>
              <Badge variant="secondary">247</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tickets Sold (30d)</span>
              <Badge variant="secondary">45,832</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Revenue (30d)</span>
              <Badge variant="secondary">$892,450</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">New Registrations</span>
              <Badge variant="secondary">1,203</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up scroll-delay-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="flex-1 text-sm text-red-800">
                5 event requests require immediate review
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div className="flex-1 text-sm text-yellow-800">
                Database backup scheduled in 2 hours
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1 text-sm text-green-800">
                System security scan completed successfully
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up scroll-delay-700">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Administrative Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <Users className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">User Role Management</div>
              <div className="text-sm text-gray-600">Assign and modify user roles</div>
            </div>
          </Button>
          
          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <Settings className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">System Settings</div>
              <div className="text-sm text-gray-600">Configure platform settings</div>
            </div>
          </Button>

          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <FileText className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Audit Logs</div>
              <div className="text-sm text-gray-600">View system activity logs</div>
            </div>
          </Button>

          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <BarChart3 className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Analytics Dashboard</div>
              <div className="text-sm text-gray-600">Detailed platform analytics</div>
            </div>
          </Button>

          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <Shield className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Security Center</div>
              <div className="text-sm text-gray-600">Security monitoring and alerts</div>
            </div>
          </Button>

          <Button className="justify-start h-auto p-4 hover-glow" variant="outline">
            <Database className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Database Management</div>
              <div className="text-sm text-gray-600">Backup and maintenance tools</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}