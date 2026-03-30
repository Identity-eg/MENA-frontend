import { ArrowLeft, FileText } from 'lucide-react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { getRequestQueryOptions } from '@/apis/requests/get-request'
import { RequestDetailLoadingFallback } from '@/components/requests/request-detail-loading-fallback'
import { RequestDetailView } from '@/components/requests/request-detail-view'

export const Route = createFileRoute('/_protected/requests/$requestId')({
  component: RequestDetailsPage,
  loader: async ({ context, params }) => {
    const requestId = Number(params.requestId)
    if (Number.isNaN(requestId)) throw notFound()
    try {
      await context.queryClient.ensureQueryData(
        getRequestQueryOptions(requestId),
      )
    } catch {
      throw notFound()
    }
  },
  errorComponent: () => (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="rounded-full bg-destructive/10 p-4">
        <FileText className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          We couldn&apos;t load this request. Please try again or return to your
          requests.
        </p>
      </div>
      <Link to="/requests">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to requests
        </Button>
      </Link>
    </div>
  ),
  pendingComponent: RequestDetailLoadingFallback,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="rounded-full bg-muted p-4">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Request not found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          This request doesn&apos;t exist or you don&apos;t have access to view
          it.
        </p>
      </div>
      <Link to="/requests">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to requests
        </Button>
      </Link>
    </div>
  ),
})

export default function RequestDetailsPage() {
  return <RequestDetailView />
}
