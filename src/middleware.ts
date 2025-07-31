import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@/generated/prisma'
import { logger } from '@/lib/logger'

// Define protected routes and their required roles
const PROTECTED_ROUTES: Record<string, Role[]> = {
  '/dashboard': ['USER', 'ADMIN', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
  '/dashboard/super-admin': ['SUPER_ADMIN'],
  '/dashboard/moderator': ['MODERATOR', 'SUPER_ADMIN'],
  '/dashboard/organizer': ['ORGANIZER', 'SUPER_ADMIN'],
  '/dashboard/support': ['SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
  '/dashboard/user': ['USER', 'ADMIN', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
  '/dashboard/profile': ['USER', 'ADMIN', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
  '/admin': ['ADMIN', 'MODERATOR', 'SUPER_ADMIN'],
  '/buy-ticket': ['USER', 'ADMIN', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
  '/ticket': ['USER', 'ADMIN', 'ORGANIZER', 'SUPPORT', 'MODERATOR', 'SUPER_ADMIN'],
}

// Get current user from NextAuth JWT token
async function getCurrentUser(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return null
    }
    
    return {
      id: token.sub || '',
      role: token.role as Role,
      email: token.email as string,
      isAuthenticated: true
    }
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

function hasRequiredRole(userRole: Role, requiredRoles: Role[]): boolean {
  const ROLE_HIERARCHY: Record<Role, number> = {
    USER: 1,
    ADMIN: 2,
    ORGANIZER: 3,
    SUPER_ADMIN: 4,
    MODERATOR: 5,
    SUPPORT: 6
  }
  
  const userLevel = ROLE_HIERARCHY[userRole]
  return requiredRoles.some(role => userLevel >= ROLE_HIERARCHY[role])
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle API route logging
  if (pathname.startsWith('/api/')) {
    const user = await getCurrentUser(request)
    const requestId = Math.random().toString(36).substring(2, 15)
    const url = new URL(request.url)
    
    // Log API request
    // logger.info({
    //   requestId,
    //   method: request.method,
    //   path: pathname,
    //   query: Object.fromEntries(url.searchParams.entries()),
    //   user: user ? {
    //     id: user.id,
    //     email: user.email,
    //     role: user.role
    //   } : null,
    //   ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    // }, 'API Request')

    // Add request tracking headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-request-id', requestId)
    
    if (user) {
      requestHeaders.set('x-user-id', user.id)
      requestHeaders.set('x-user-role', user.role)
      requestHeaders.set('x-user-email', user.email)
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.headers.set('x-request-id', requestId)
    return response
  }

  // Check if the route is protected
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(route => 
    pathname.startsWith(route)
  )
  
  if (protectedRoute) {
    const user = await getCurrentUser(request)
    const requiredRoles = PROTECTED_ROUTES[protectedRoute]
    
    // If user is not authenticated
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      loginUrl.searchParams.set('message', 'Please log in to access this page')
      return NextResponse.redirect(loginUrl)
    }
    
    // If user doesn't have required role
    if (!hasRequiredRole(user.role, requiredRoles)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // Add user info to headers for server components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.id)
    requestHeaders.set('x-user-role', user.role)
    requestHeaders.set('x-user-email', user.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths including API routes for logging
     * Exclude static files and images
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}