'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Settings,
  BarChart3,
  Users,
  Calendar,
  Ticket,
  Shield,
  Building,
  FileText,
  MessageCircle,
  Bell,
  ChevronDown,
  Menu,
  X, HeartPlus
} from 'lucide-react'
import { Role } from '@/generated/prisma'

interface SidebarProps {
  userRole: Role
  userName: string
  userEmail: string
}

interface NavItem {
  label: string
  href: string
  icon: any
  roles: Role[]
  badge?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
    roles: ['USER', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN']
  },
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['USER', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN']
  },
  {
    label: 'My Tickets',
    href: '/dashboard/tickets',
    icon: Ticket,
    roles: ['USER', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN']
  },
  
  // Organizer specific
  {
    label: 'My Events',
    href: '/dashboard/organizer/events',
    icon: Calendar,
    roles: ['ORGANIZER', 'SUPER_ADMIN'],
    children: [
      {
        label: 'All Events',
        href: '/dashboard/organizer/events',
        icon: Calendar,
        roles: ['ORGANIZER', 'SUPER_ADMIN']
      },
      {
        label: 'Create Event',
        href: '/dashboard/organizer/events/create',
        icon: Calendar,
        roles: ['ORGANIZER', 'SUPER_ADMIN']
      },
      {
        label: 'Analytics',
        href: '/dashboard/organizer/analytics',
        icon: BarChart3,
        roles: ['ORGANIZER', 'SUPER_ADMIN']
      }
    ]
  },
  {
    label: 'Organization',
    href: '/dashboard/organizer/organization',
    icon: Building,
    roles: ['ORGANIZER', 'SUPER_ADMIN']
  },
  
  // Support specific
  {
    label: 'Support Tickets',
    href: '/dashboard/support/tickets',
    icon: HeartPlus,
    roles: ['SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
    badge: '12'
  },
  {
    label: 'User Management',
    href: '/dashboard/support/users',
    icon: Users,
    roles: ['SUPPORT', 'MODERATOR', 'SUPER_ADMIN']
  },
  
  // Moderator specific
  {
    label: 'Content Moderation',
    href: '/dashboard/moderator/content',
    icon: Shield,
    roles: ['MODERATOR', 'SUPER_ADMIN'],
    children: [
      {
        label: 'Event Requests',
        href: '/dashboard/moderator/event-requests',
        icon: FileText,
        roles: ['MODERATOR', 'SUPER_ADMIN'],
        badge: '5'
      },
      {
        label: 'Reported Content',
        href: '/dashboard/moderator/reports',
        icon: MessageCircle,
        roles: ['MODERATOR', 'SUPER_ADMIN'],
        badge: '3'
      }
    ]
  },
  {
    label: 'Analytics',
    href: '/dashboard/moderator/analytics',
    icon: BarChart3,
    roles: ['MODERATOR', 'SUPER_ADMIN']
  },
  
  // Super Admin specific
  {
    label: 'System Admin',
    href: '/dashboard/super-admin',
    icon: Shield,
    roles: ['SUPER_ADMIN'],
    children: [
      {
        label: 'User Roles',
        href: '/dashboard/super-admin/roles',
        icon: Users,
        roles: ['SUPER_ADMIN']
      },
      {
        label: 'System Settings',
        href: '/dashboard/super-admin/settings',
        icon: Settings,
        roles: ['SUPER_ADMIN']
      },
      {


        label: 'Audit Logs',
        href: '/dashboard/super-admin/audit',
        icon: FileText,
        roles: ['SUPER_ADMIN']
      }
    ]
  },
  
  // Common settings
  {
    label:
        'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    roles: ['USER', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
    badge: '2'
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['USER', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN']
  }
]

function hasAccess(item: NavItem, userRole: Role): boolean {
  return item.roles.includes(userRole)
}

export default function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const filteredNavigation = navigation.filter(item => hasAccess(item, userRole))

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        w-64 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileOpen ? 'translate-x-0 fixed top-16 left-0 z-40' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {userRole.toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredNavigation.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={`
                          w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors
                          ${pathname.startsWith(item.href) 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="mr-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          expandedItems.includes(item.label) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {expandedItems.includes(item.label) && (
                        <ul className="mt-1 ml-4 space-y-1">
                          {item.children.filter(child => hasAccess(child, userRole)).map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                className={`
                                  flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                                  ${pathname === child.href 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                  }
                                `}
                                onClick={() => setIsMobileOpen(false)}
                              >
                                <child.icon className="mr-3 h-4 w-4" />
                                {child.label}
                                {child.badge && (
                                  <Badge variant="destructive" className="ml-auto text-xs">
                                    {child.badge}
                                  </Badge>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${pathname === item.href 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.label}
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Back to Site</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed top-16 left-0 bottom-0 right-0 z-30 bg-black bg-opacity-50 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}