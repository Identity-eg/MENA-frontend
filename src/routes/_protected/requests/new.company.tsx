import { createFileRoute } from '@tanstack/react-router'
import { FullPageLoading } from '@/components/ui/full-page-loading'

export const Route = createFileRoute('/_protected/requests/new/company')({
  pendingComponent: FullPageLoading,
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/requests/new/company"!</div>
}
