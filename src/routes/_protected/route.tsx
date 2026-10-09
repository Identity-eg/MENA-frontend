import {
  createFileRoute,
  ErrorComponent,
  Outlet,
  redirect,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { FullPageLoading } from '@/components/ui/full-page-loading'

import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'

/** The session exists but could not be refreshed right now (e.g. 429). Not a logout. */
class AuthTemporarilyUnavailableError extends Error {
  constructor() {
    super('Your session could not be refreshed right now.')
    this.name = 'AuthTemporarilyUnavailableError'
  }
}

export const Route = createFileRoute('/_protected')({
  ssr: false,
  pendingComponent: FullPageLoading,
  beforeLoad: ({ context }) => {
    const user = context.user
    if (!user) {
      if (context.authTransient) throw new AuthTemporarilyUnavailableError()
      throw redirect({ to: '/auth/login' })
    }
  },
  errorComponent: ProtectedErrorComponent,
  component: RouteComponent,
})

function ProtectedErrorComponent(props: ErrorComponentProps) {
  if (!(props.error instanceof AuthTemporarilyUnavailableError)) {
    return <ErrorComponent {...props} />
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <h2 className="text-lg font-semibold">Please wait a moment</h2>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t refresh your session right now. You are still signed
          in, please try again in a few seconds.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  )
}

function RouteComponent() {
  useRealtimeNotifications()
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
