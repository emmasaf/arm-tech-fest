import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

interface DashboardStat {
  title: string
  value: string | number
  icon: string
  color: string
}

interface DashboardAlert {
  type: 'urgent' | 'warning' | 'success' | 'info'
  message: string
}

interface DashboardData {
  title: string
  description: string
  stats?: DashboardStat[]
  alerts?: DashboardAlert[]
}

export function useDashboardStats() {
  const { data: session } = useSession()

  return useQuery<DashboardData>({
    queryKey: ['dashboard-stats', session?.user?.role],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/stats?role=${session?.user?.role}`)
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      return response.json()
    },
    enabled: !!session?.user,
    refetchInterval: 30000, // Refetch every 30 seconds for live data
  })
}