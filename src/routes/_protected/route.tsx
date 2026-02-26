import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    const user = context.user
    if (!user) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  useRealtimeNotifications()
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
