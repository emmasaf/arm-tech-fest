'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/dashboard/sidebar'
import { Loader2 } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        userRole={session.user.role || 'USER'}
        userName={session.user.name || 'Unknown User'}
        userEmail={session.user.email || ''}
      />
      <main className="flex-1 mt-16">
        <div className="p-4 pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}