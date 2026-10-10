import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleSlash,
  Clock,
  RotateCw,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'

import type { TPlanPurchase } from '@/types/credits'
import type {PurchaseStatusDisplay} from '@/lib/plan-checkout';
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetPlanPurchases } from '@/apis/credits/get-plan-purchases'
import { formatPlanPrice } from '@/lib/credit-plans'
import { formatCredits } from '@/lib/credits'
import {
  
  describePurchaseStatus
} from '@/lib/plan-checkout'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

const boughtAt = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

/**
 * The user's Plan purchases with their payment status. Shown only once the user has started a
 * checkout; before that the Credit history's empty state already points to the plans.
 */
export function PlanPurchasesSection() {
  const [page, setPage] = useState(1)
  const query = useGetPlanPurchases({ page, pageSize: PAGE_SIZE })

  if (query.isSuccess && query.data.pagination.total === 0) return null

  return (
    <section
      aria-labelledby="plan-purchases-heading"
      className="space-y-5 rounded-2xl border bg-card p-4 sm:p-6"
    >
      <div className="space-y-1">
        <h2
          id="plan-purchases-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Purchases
        </h2>
        <p className="text-sm text-muted-foreground">
          Credit plans you bought and whether each payment went through.
        </p>
      </div>

      <div aria-live="polite" aria-busy={query.isFetching}>
        {query.isPending ? (
          <PurchasesSkeleton />
        ) : query.isError ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-xl bg-destructive/5 p-4 ring-1 ring-destructive/20 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-foreground">
              We couldn&rsquo;t load your purchases.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="min-h-11 gap-2"
              onClick={() => query.refetch()}
            >
              <RotateCw className="size-4" aria-hidden />
              Try again
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              'transition-opacity duration-300',
              query.isPlaceholderData && 'opacity-60',
            )}
          >
            <ul className="divide-y divide-border/70">
              {query.data.data.map((purchase) => (
                <PurchaseRow key={purchase.id} purchase={purchase} />
              ))}
            </ul>
            {query.data.pagination.totalPages > 1 && (
              <nav
                aria-label="Purchases pages"
                className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4"
              >
                <p className="text-sm text-muted-foreground tabular-nums">
                  Page {query.data.pagination.page} of{' '}
                  {query.data.pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon-lg"
                    className="size-11"
                    aria-label="Previous page"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft aria-hidden />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    className="size-11"
                    aria-label="Next page"
                    disabled={page >= query.data.pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight aria-hidden />
                  </Button>
                </div>
              </nav>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function PurchaseRow({ purchase }: { purchase: TPlanPurchase }) {
  const status = describePurchaseStatus(purchase.status)
  return (
    <li className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">
          {purchase.planName} Credit plan
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          <time dateTime={purchase.createdAt}>
            {boughtAt.format(new Date(purchase.createdAt))}
          </time>
          {', '}
          {formatPlanPrice(purchase.priceCents)}
        </p>
      </div>
      <div className="flex items-center gap-3 sm:justify-end">
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            purchase.status === 'PAID' &&
              'text-emerald-700 dark:text-emerald-400',
            purchase.status === 'PENDING' && 'text-muted-foreground',
            (purchase.status === 'FAILED' || purchase.status === 'EXPIRED') &&
              'text-muted-foreground line-through decoration-muted-foreground/50',
          )}
        >
          +{formatCredits(purchase.credits)}
        </span>
        <StatusBadge status={status} />
      </div>
    </li>
  )
}

const STATUS_STYLE = {
  pending: {
    icon: Clock,
    className:
      'bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:text-amber-300',
  },
  success: {
    icon: CircleCheck,
    className:
      'bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-300',
  },
  failure: {
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive ring-destructive/20',
  },
  muted: {
    icon: CircleSlash,
    className: 'bg-muted text-muted-foreground ring-border',
  },
} as const

/** Status with an icon and a word, never colour alone. */
function StatusBadge({ status }: { status: PurchaseStatusDisplay }) {
  const { icon: Icon, className } = STATUS_STYLE[status.tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      {status.label}
    </span>
  )
}

function PurchasesSkeleton() {
  return (
    <ul className="divide-y divide-border/70" aria-label="Loading purchases">
      {[0, 1].map((i) => (
        <li
          key={i}
          className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
        >
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </li>
      ))}
    </ul>
  )
}
