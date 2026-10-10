import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, FileSearch } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { RequestListItem } from '@/components/requests/request-list-item'
import { buttonVariants } from '@/components/ui/button'
import { FullPageLoading } from '@/components/ui/full-page-loading'

import {
  getRequestsQueryOptions,
  useGetRequests,
} from '@/apis/requests/get-requests'
import {
  getUnlocksQueryOptions,
  useGetUnlocks,
} from '@/apis/unlocks/get-unlocks'
import { useGetMe } from '@/apis/user/get-me'
import { formatUsd } from '@/lib/request-display'
import { getNextStep, getRequestGroup } from '@/lib/request-next-step'
import { cn } from '@/lib/utils'
import type { TRequest } from '@/types/request'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardPage,
  pendingComponent: FullPageLoading,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getRequestsQueryOptions()),
      context.queryClient.ensureQueryData(getUnlocksQueryOptions()),
    ])
    return {}
  },
})

const RECENT_LIMIT = 5
/** Completed requests stay in "Needs your attention" this long after delivery. */
const RECENTLY_COMPLETED_MS = 30 * 24 * 60 * 60 * 1000

function byNewest(a: TRequest, b: TRequest) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

/** Payable requests first (overdue on top), then recently completed ones. */
function getAttentionRequests(requests: Array<TRequest>) {
  const now = Date.now()
  const rank = (r: TRequest) => {
    const step = getNextStep(r)
    if (step.kind === 'pay') return step.overdue ? 0 : 1
    if (
      step.kind === 'download' &&
      now - new Date(r.updatedAt).getTime() < RECENTLY_COMPLETED_MS
    )
      return 2
    return null
  }
  return requests
    .map((r) => ({ r, rank: rank(r) }))
    .filter((x): x is { r: TRequest; rank: number } => x.rank != null)
    .sort((a, b) => a.rank - b.rank || byNewest(a.r, b.r))
    .map((x) => x.r)
}

type Stat = {
  label: string
  value: number
  hint: string
  search?: { tab: 'needs-action' | 'in-progress' | 'completed' }
  to: '/requests' | '/unlocks'
  highlight?: boolean
}

function StatsStrip({ stats }: { stats: Array<Stat> }) {
  return (
    <nav
      aria-label="Overview"
      className="grid grid-cols-2 overflow-hidden rounded-xl border bg-card lg:grid-cols-4"
    >
      {stats.map((stat, idx) => (
        <Link
          key={stat.label}
          to={stat.to}
          search={stat.search}
          className={cn(
            'group flex flex-col gap-1 px-4 py-4 outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-5',
            idx % 2 === 1 && 'border-l',
            idx >= 2 && 'border-t lg:border-t-0',
            idx === 2 && 'lg:border-l',
          )}
        >
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            {stat.label}
            <ArrowRight
              aria-hidden
              className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </span>
          <span
            className={cn(
              'text-2xl font-semibold tracking-tight tabular-nums',
              stat.highlight && 'text-amber-700 dark:text-amber-300',
            )}
          >
            {stat.value}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {stat.hint}
          </span>
        </Link>
      ))}
    </nav>
  )
}

function SectionHeader({
  id,
  title,
  description,
  action,
}: {
  id: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-base font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

function DashboardPage() {
  const { data: requestsData } = useGetRequests()
  const { data: unlocksData } = useGetUnlocks()
  const { data: meData } = useGetMe()

  const requests: Array<TRequest> = requestsData.data
  const unlocks = unlocksData.data
  const firstName = meData?.user.name.split(' ')[0]

  const groups = requests.map(getRequestGroup)
  const count = (g: ReturnType<typeof getRequestGroup>) =>
    groups.filter((x) => x === g).length
  const totalDue = requests.reduce((sum, r) => {
    const step = getNextStep(r)
    return step.kind === 'pay' ? sum + step.amount : sum
  }, 0)

  const attention = getAttentionRequests(requests)
  const recent = [...requests].sort(byNewest).slice(0, RECENT_LIMIT)

  const stats: Array<Stat> = [
    {
      label: 'Needs action',
      value: count('needs-action'),
      hint: totalDue > 0 ? `${formatUsd(totalDue)} to pay` : 'Nothing to pay',
      to: '/requests',
      search: { tab: 'needs-action' },
      highlight: count('needs-action') > 0,
    },
    {
      label: 'In progress',
      value: count('in-progress'),
      hint: 'Being prepared',
      to: '/requests',
      search: { tab: 'in-progress' },
    },
    {
      label: 'Completed',
      value: count('completed'),
      hint: 'Ready to download',
      to: '/requests',
      search: { tab: 'completed' },
    },
    {
      label: 'Unlocks',
      value: unlocks.length,
      hint: 'Fields unlocked',
      to: '/unlocks',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
        subtitle="Here's where your requests stand."
        action={
          <Link
            to="/companies"
            className={buttonVariants({ className: 'px-3' })}
          >
            New request
          </Link>
        }
      />

      {requests.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
          <FileSearch aria-hidden className="size-8 text-muted-foreground" />
          <h2 className="mt-4 text-sm font-medium text-foreground">
            Order your first report
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Search for a company, choose the reports you need, and we'll take it
            from there. Your requests and their progress will show up here.
          </p>
          <Link
            to="/companies"
            className={buttonVariants({ className: 'mt-5 px-4' })}
          >
            Browse companies
          </Link>
        </div>
      ) : (
        <>
          <section aria-labelledby="attention-heading">
            <SectionHeader
              id="attention-heading"
              title="Needs your attention"
              description={
                attention.length > 0
                  ? 'Invoices to pay and reports ready to download.'
                  : undefined
              }
            />
            {attention.length > 0 ? (
              <ul className="divide-y overflow-hidden rounded-xl border bg-card">
                {attention.map((r) => (
                  <RequestListItem key={r.id} request={r} />
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-4">
                <CheckCircle2
                  aria-hidden
                  className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                <div>
                  <p className="text-sm font-medium">You're all caught up</p>
                  <p className="text-sm text-muted-foreground">
                    Nothing needs your action. We'll let you know when an
                    invoice or report is ready.
                  </p>
                </div>
              </div>
            )}
          </section>

          <StatsStrip stats={stats} />

          <section aria-labelledby="recent-heading">
            <SectionHeader
              id="recent-heading"
              title="Recent requests"
              action={
                <Link
                  to="/requests"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View all
                </Link>
              }
            />
            <ul className="divide-y overflow-hidden rounded-xl border bg-card">
              {recent.map((r) => (
                <RequestListItem key={r.id} request={r} />
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
