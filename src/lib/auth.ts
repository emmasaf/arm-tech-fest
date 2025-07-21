'use client'

import { Role } from '@/generated/prisma'

export interface User {
  id: string
  email: string
  name: string | null
  role: Role
  organization: string | null
  permissions: any
  isActive: boolean
  image: string | null
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (roles: Role | Role[]) => boolean
  hasPermission: (permission: string) => boolean
}

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 1,
  ADMIN: 2,
  ORGANIZER: 3,
  SUPER_ADMIN: 4,
  MODERATOR: 5,
  SUPPORT: 6
}

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  USER: [
    'view:events',
    'buy:tickets',
    'view:own-tickets',
    'update:own-profile'
  ],
  ADMIN: [
    'view:events',
    'buy:tickets',
    'view:own-tickets',
    'update:own-profile',
    'view:users',
    'manage:basic-settings',
    'view:analytics',
    'send:notifications'
  ],
  ORGANIZER: [
    'view:events',
    'create:events',
    'update:own-events',
    'view:own-events',
    'view:own-tickets-sold',
    'manage:own-organization'
  ],
  SUPPORT: [
    'view:events',
    'view:tickets',
    'view:support-tickets',
    'update:support-tickets',
    'view:users',
    'send:notifications'
  ],
  MODERATOR: [
    'view:all',
    'moderate:events',
    'moderate:users',
    'view:analytics',
    'manage:categories',
    'review:event-requests'
  ],
  SUPER_ADMIN: [
    'manage:all',
    'view:all',
    'delete:all',
    'manage:roles',
    'manage:permissions',
    'view:audit-logs'
  ]
}

export function hasRoleAccess(userRole: Role, requiredRoles: Role | Role[]): boolean {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  const userLevel = ROLE_HIERARCHY[userRole]
  
  return roles.some(role => userLevel >= ROLE_HIERARCHY[role])
}

export function hasPermission(userRole: Role, permission: string, customPermissions?: string[]): boolean {
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  
  // Check custom permissions
  const allPermissions = [...rolePermissions, ...(customPermissions || [])]
  
  // Super admin has all permissions
  if (userRole === 'SUPER_ADMIN') return true
  
  // Check exact permission or wildcard permissions
  return allPermissions.some(perm => 
    perm === permission || 
    perm === 'manage:all' || 
    perm === 'view:all' ||
    (perm.endsWith(':all') && permission.startsWith(perm.split(':')[0] + ':'))
  )
}

// Mock user data - replace with actual authentication
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@festfub.com',
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    organization: 'ArmEventHub',
    permissions: {},
    isActive: true,
    image: null
  },
  {
    id: '2', 
    email: 'moderator@festfub.com',
    name: 'John Moderator',
    role: 'MODERATOR',
    organization: 'ArmEventHub',
    permissions: {},
    isActive: true,
    image: null
  },
  {
    id: '3',
    email: 'organizer@example.com', 
    name: 'Jane Organizer',
    role: 'ORGANIZER',
    organization: 'Event Masters LLC',
    permissions: {},
    isActive: true,
    image: null
  },
  {
    id: '4',
    email: 'support@festfub.com',
    name: 'Support Agent',
    role: 'SUPPORT', 
    organization: 'ArmEventHub',
    permissions: {},
    isActive: true,
    image: null
  },
  {
    id: '5',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'USER',
    organization: null,
    permissions: {},
    isActive: true,
    image: null
  },
  {
    id: '6',
    email: 'admin.basic@festfub.com',
    name: 'Basic Admin',
    role: 'ADMIN',
    organization: 'ArmEventHub',
    permissions: {},
    isActive: true,
    image: null
  }
]