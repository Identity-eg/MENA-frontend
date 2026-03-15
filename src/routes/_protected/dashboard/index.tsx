import { Link, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { CheckCircle2, Clock, FileText, Loader2, Unlock } from 'lucide-react'
import type { RequestStatusValue, TRequest } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'
import {
  getUnlocksQueryOptions,
  useGetUnlocks,
} from '@/apis/unlocks/get-unlocks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { DashboardRecentRequests } from '@/components/dashboard-recent-requests'
import {
  getRequestsQueryOptions,
  useGetRequests,
} from '@/apis/requests/get-requests'
import { useGetMe } from '@/apis/user/get-me'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardPage,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="text-primary size-6" />
      </div>
    )
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getRequestsQueryOptions()),
      context.queryClient.ensureQueryData(getUnlocksQueryOptions()),
    ])
    return {}
  },
})

const activeRequestStatuses = new Set<RequestStatusValue>([
  REQUEST_STATUS.UNDER_REVIEW,
  REQUEST_STATUS.INVOICE_GENERATED,
  REQUEST_STATUS.PAID,
  REQUEST_STATUS.PROCESSING,
])

const formatUsdAmount = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

function DashboardPage() {
  const { data: requestsData } = useGetRequests()
  const { data: unlocksData } = useGetUnlocks()

  const requests: Array<TRequest> = requestsData.data
  const unlocks = unlocksData.data

  const activeRequestsCount = requests.filter((request) =>
    activeRequestStatuses.has(request.status),
  ).length

  const pendingPaymentRequests = requests.filter(
    (request) => request.status === REQUEST_STATUS.INVOICE_GENERATED,
  )
  const pendingPaymentsTotal = pendingPaymentRequests.reduce(
    (sum, request) =>
      sum + (request.invoice?.amount ?? request.totalEstimatedPrice),
    0,
  )

  const completedRequestsCount = requests.filter(
    (request) => request.status === REQUEST_STATUS.COMPLETED,
  ).length

  const { data: meData } = useGetMe()

  const user = meData?.user

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${user?.name}. Here's your compliance overview.`}
        />
        <Link to="/requests/new/individual">
          <Button>New Request</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRequestsCount}</div>
            <p className="text-xs text-muted-foreground">
              {requests.length} total request{requests.length === 1 ? '' : 's'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingPaymentRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total due: {formatUsdAmount(pendingPaymentsTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRequestsCount}</div>
            <p className="text-xs text-muted-foreground">Completed requests</p>
          </CardContent>
        </Card>
        <Link to="/unlocks">
          <Card className="cursor-pointer hover:ring-primary/50 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Unlocks</CardTitle>
              <Unlock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                {unlocks.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Company intelligence unlocks
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        }
      >
        <DashboardRecentRequests />
      </Suspense>
    </div>
  )
}
