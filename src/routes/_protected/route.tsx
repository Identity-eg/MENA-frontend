import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'
import { FullPageLoading } from '@/components/ui/full-page-loading'

export const Route = createFileRoute('/_protected')({
  ssr: false,
  pendingComponent: FullPageLoading,
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
