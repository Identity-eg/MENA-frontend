import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/dashboard-layout'
import { getIsomorphicAccessToken } from '@/apis/request/request-interceptor'

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
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
