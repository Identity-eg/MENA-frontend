import { Link } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  History,
  RotateCw,
  SearchX,
} from 'lucide-react'

import { CreditHistoryFilters } from './credit-history-filters'
import { CreditHistoryList, CreditHistorySkeleton } from './credit-history-list'
import type {CreditHistorySearch} from '@/lib/credit-history';
import { Button } from '@/components/ui/button'

import { useGetCreditTransactions } from '@/apis/credits/get-credit-transactions'
import {
  
  creditHistoryParams
} from '@/lib/credit-history'
import { cn } from '@/lib/utils'

export const CREDIT_HISTORY_PAGE_SIZE = 20

type CreditHistorySectionProps = {
  search: CreditHistorySearch
  onSearchChange: (next: CreditHistorySearch) => void
}

/** The Credit history: filters, the paginated list, and its loading, empty and error states. */
export function CreditHistorySection({
  search,
  onSearchChange,
}: CreditHistorySectionProps) {
  const query = useGetCreditTransactions(
    creditHistoryParams(search, CREDIT_HISTORY_PAGE_SIZE),
  )
  const narrowed = Boolean(
    search.type || search.from || search.to || (search.page ?? 1) > 1,
  )

  return (
    <section
      aria-labelledby="credit-history-heading"
      className="space-y-5 rounded-2xl border bg-card p-4 sm:p-6"
    >
      <div className="space-y-1">
        <h2
          id="credit-history-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Credit history
        </h2>
        <p className="text-sm text-muted-foreground">
          Every Credit added or spent, newest first, with the balance after it.
        </p>
      </div>

      <CreditHistoryFilters search={search} onChange={onSearchChange} />

      <div aria-live="polite" aria-busy={query.isFetching}>
        {query.isPending ? (
          <CreditHistorySkeleton />
        ) : query.isError ? (
          <HistoryError onRetry={() => query.refetch()} />
        ) : query.data.data.length === 0 ? (
          narrowed ? (
            <NothingMatches onClear={() => onSearchChange({})} />
          ) : (
            <NoCreditsYet />
          )
        ) : (
          <div
            className={cn(
              'transition-opacity duration-300',
              query.isPlaceholderData && 'opacity-60',
            )}
          >
            <CreditHistoryList transactions={query.data.data} />
            <Pagination
              page={query.data.pagination.page}
              totalPages={query.data.pagination.totalPages}
              total={query.data.pagination.total}
              pageSize={query.data.pagination.pageSize}
              disabled={query.isPlaceholderData}
              onPageChange={(page) =>
                onSearchChange({ ...search, page: page > 1 ? page : undefined })
              }
            />
          </div>
        )}
      </div>
    </section>
  )
}

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  disabled,
  onPageChange,
}: {
  page: number
  totalPages: number
  total: number
  pageSize: number
  disabled: boolean
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null
  const first = (page - 1) * pageSize + 1
  const last = Math.min(total, page * pageSize)

  return (
    <nav
      aria-label="Credit history pages"
      className="mt-5 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {first}–{last} of {total.toLocaleString('en-US')}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-11 sm:h-9"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden className="rtl:rotate-180" />
          Previous
        </Button>
        <span className="px-2 text-sm text-muted-foreground tabular-nums">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          className="h-11 sm:h-9"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight aria-hidden className="rtl:rotate-180" />
        </Button>
      </div>
    </nav>
  )
}

function StatePanel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof History
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Icon
          className="size-6 text-muted-foreground"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}

function NoCreditsYet() {
  return (
    <StatePanel
      icon={History}
      title="No Credits yet — see plans"
      description="Buy a Credit plan to start unlocking Sensitive fields. Every Credit added or spent will be listed here."
    >
      <Link
        to="/pricing"
        search={{ returnTo: '/credits' }}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        See plans
      </Link>
    </StatePanel>
  )
}

function NothingMatches({ onClear }: { onClear: () => void }) {
  return (
    <StatePanel
      icon={SearchX}
      title="No transactions match"
      description="Try another type or a wider date range."
    >
      <Button variant="outline" className="h-11" onClick={onClear}>
        Clear filters
      </Button>
    </StatePanel>
  )
}

function HistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert">
      <StatePanel
        icon={RotateCw}
        title="Your Credit history couldn't be loaded"
        description="Check your connection and try again."
      >
        <Button variant="outline" className="h-11" onClick={onRetry}>
          <RotateCw aria-hidden />
          Try again
        </Button>
      </StatePanel>
    </div>
  )
}
