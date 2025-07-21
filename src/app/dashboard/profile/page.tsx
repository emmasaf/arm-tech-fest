'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Edit,
  Save,
  Shield
} from 'lucide-react'
import { mockUsers, type User as UserType } from '@/lib/auth'
import { Role } from '@/generated/prisma'

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    organization: '',
    website: ''
  })

  useEffect(() => {
    const userId = localStorage.getItem('user-id')
    const userRole = localStorage.getItem('user-role') as Role
    
    if (userId && userRole) {
      const foundUser = mockUsers.find(u => u.id === userId && u.role === userRole)
      if (foundUser) {
        setUser(foundUser)
        setFormData({
          name: foundUser.name || '',
          email: foundUser.email,
          phone: '(555) 123-4567', // Mock data
          bio: 'Passionate about bringing amazing event experiences to communities.',
          location: 'New York, NY',
          organization: foundUser.organization || '',
          website: 'https://example.com'
        })
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false)
    // Show success message
  }

  if (!user) return null

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2 animate-fade-in-up scroll-delay-200">
            Manage your account information and preferences
          </p>
        </div>
        <div className="animate-fade-in-up scroll-delay-300">
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="hover-glow">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="hover-lift">
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="hover-glow">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card className="animate-fade-in-up scroll-delay-400">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Unknown User'}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role.toLowerCase().replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Member since 2023
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="animate-fade-in-up scroll-delay-500">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      {(user.role === 'ORGANIZER' || user.role === 'SUPER_ADMIN') && (
        <Card className="animate-fade-in-up scroll-delay-600">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Your organization and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Statistics */}
      <Card className="animate-fade-in-up scroll-delay-700">
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user.role === 'USER' && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-gray-600">Tickets Purchased</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Events Attended</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">$450</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </>
            )}
            
            {user.role === 'ORGANIZER' && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-gray-600">Active Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-gray-600">Tickets Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">$31,450</div>
                  <div className="text-sm text-gray-600">Revenue Generated</div>
                </div>
              </>
            )}

            {(user.role === 'SUPPORT' || user.role === 'MODERATOR' || user.role === 'SUPER_ADMIN') && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-600">Users Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">Resolution Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.3h</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="animate-fade-in-up scroll-delay-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-gray-600">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" size="sm" className="hover-lift">
              Change Password
            </Button>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm" className="hover-lift">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}