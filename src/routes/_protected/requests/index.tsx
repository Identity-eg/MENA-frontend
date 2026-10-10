import { createFileRoute, Link } from '@tanstack/react-router'
import { FileSearch, Search } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/page-header'
import {
  RequestListHeader,
  RequestListItem,
} from '@/components/requests/request-list-item'
import { buttonVariants } from '@/components/ui/button'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  getRequestsQueryOptions,
  useGetRequests,
} from '@/apis/requests/get-requests'
import { formatRequestId, getRequestCompanies } from '@/lib/request-display'
import { getRequestGroup, type RequestGroup } from '@/lib/request-next-step'
import type { TRequest } from '@/types/request'

type RequestsTab = 'all' | RequestGroup

const TABS: Array<{ value: RequestsTab; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'needs-action', label: 'Needs action' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
]

type RequestsSearch = { tab?: Exclude<RequestsTab, 'all'> }

export const Route = createFileRoute('/_protected/requests/')({
  component: RequestsPage,
  pendingComponent: FullPageLoading,
  validateSearch: (search: Record<string, unknown>): RequestsSearch => ({
    tab: TABS.some((t) => t.value === search.tab && t.value !== 'all')
      ? (search.tab as RequestsSearch['tab'])
      : undefined,
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRequestsQueryOptions())
    return {}
  },
})

/** Requests that need the customer first, then newest first. */
function sortRequests(requests: Array<TRequest>) {
  return [...requests].sort((a, b) => {
    const aAction = getRequestGroup(a) === 'needs-action' ? 0 : 1
    const bAction = getRequestGroup(b) === 'needs-action' ? 0 : 1
    if (aAction !== bAction) return aAction - bAction
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function matchesSearch(request: TRequest, query: string) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    formatRequestId(request.id).toLowerCase().includes(q) ||
    getRequestCompanies(request).some(
      (c) =>
        c.companyNameEn.toLowerCase().includes(q) ||
        (c.companyNameAr?.toLowerCase().includes(q) ?? false),
    )
  )
}

function RequestsPage() {
  const { tab = 'all' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [search, setSearch] = useState('')

  const { data } = useGetRequests()
  const requests: Array<TRequest> = data.data

  const counts = requests.reduce<Record<RequestGroup, number>>(
    (acc, r) => {
      acc[getRequestGroup(r)] += 1
      return acc
    },
    { 'needs-action': 0, 'in-progress': 0, completed: 0, closed: 0 },
  )

  const filtered = sortRequests(
    requests.filter(
      (r) =>
        (tab === 'all' || getRequestGroup(r) === tab) &&
        matchesSearch(r, search),
    ),
  )

  const setTab = (value: RequestsTab) =>
    navigate({
      search: { tab: value === 'all' ? undefined : value },
      replace: true,
    })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Requests"
        subtitle="Every report you've ordered, and what happens next."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as RequestsTab)}
          className="min-w-0"
        >
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TabsList variant="line" aria-label="Filter requests">
              {TABS.map((t) => {
                const count = t.value === 'all' ? null : counts[t.value]
                return (
                  <TabsTrigger key={t.value} value={t.value} className="px-2.5">
                    {t.label}
                    {count != null && count > 0 && (
                      <span
                        className={
                          t.value === 'needs-action'
                            ? 'rounded-full bg-amber-100 px-1.5 text-xs font-semibold tabular-nums text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'
                            : 'text-xs tabular-nums text-muted-foreground'
                        }
                      >
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </Tabs>

        <div className="relative lg:w-72">
          <Search
            aria-hidden
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label="Search requests"
            placeholder="Search by request ID or company"
            className="h-9 pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
          <FileSearch aria-hidden className="size-8 text-muted-foreground" />
          <h2 className="mt-4 text-sm font-medium text-foreground">
            {requests.length === 0
              ? 'No requests yet'
              : search
                ? 'No requests match your search'
                : 'Nothing here right now'}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {requests.length === 0
              ? 'Find a company and order the reports you need. Your requests will appear here.'
              : search
                ? 'Try a different request ID or company name.'
                : 'Requests in this group will show up here.'}
          </p>
          {requests.length === 0 && (
            <Link
              to="/companies"
              className={buttonVariants({ className: 'mt-5 px-4' })}
            >
              Browse companies
            </Link>
          )}
        </div>
      ) : (
        <div>
          <RequestListHeader />
          <ul className="divide-y overflow-hidden rounded-xl border bg-card">
            {filtered.map((request) => (
              <RequestListItem key={request.id} request={request} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
