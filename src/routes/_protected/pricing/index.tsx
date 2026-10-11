import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, PackageOpen, RefreshCw } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/page-header'
import {
  CreditsExplainer,
  FIELD_COSTS_ID,
} from '@/components/pricing/credits-explainer'
import { PricingPlanCard } from '@/components/pricing/pricing-plan-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { getCreditPlansQueryOptions } from '@/apis/credits/get-credit-plans'
import { getFieldCostsQueryOptions } from '@/apis/credits/get-field-costs'
import { usePlanCheckout } from '@/apis/credits/start-plan-checkout'
import { describePlanValues } from '@/lib/credit-plans'
import { parseReturnTo } from '@/lib/plan-checkout'

type PricingSearch = {
  /** The page to land on after buying, e.g. the company the user wanted to unlock. */
  returnTo?: string
}

export const Route = createFileRoute('/_protected/pricing/')({
  validateSearch: (search: Record<string, unknown>): PricingSearch => {
    const target = parseReturnTo(search.returnTo)
    return target ? { returnTo: search.returnTo as string } : {}
  },
  component: PricingPage,
  // Start both reads early; the page renders its own loading and error states.
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(getCreditPlansQueryOptions())
    void context.queryClient.prefetchQuery(getFieldCostsQueryOptions())
  },
})

const BUY_NOTE_ID = 'pricing-buy-note'

function PricingPage() {
  const returnTo = parseReturnTo(Route.useSearch().returnTo)

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        {returnTo?.kind === 'company' && (
          <Link
            to="/companies/$companyId"
            params={{ companyId: returnTo.companyId }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to the company
          </Link>
        )}
        <PageHeader
          title="Pricing"
          subtitle={
            returnTo?.kind === 'company'
              ? 'Pick a plan. After paying you go straight back to the company to finish your Unlock.'
              : 'Buy Credits once, then Unlock company details whenever you need them.'
          }
        />
      </div>
      <PlanGrid />
      <CreditsExplainer />
    </div>
  )
}

function PlanGrid() {
  const returnTo = parseReturnTo(Route.useSearch().returnTo)
  const { data, isPending, isError, refetch, isRefetching } = useQuery(
    getCreditPlansQueryOptions(),
  )
  const checkout = usePlanCheckout(returnTo)

  if (isPending) return <PlanGridSkeleton />

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 rounded-2xl bg-destructive/5 p-6 ring-1 ring-destructive/20 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            We couldn&rsquo;t load the Credit plans
          </p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="min-h-11"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw
            className={
              isRefetching
                ? 'animate-spin motion-reduce:animate-none'
                : undefined
            }
            aria-hidden
          />
          Try again
        </Button>
      </div>
    )
  }

  const plans = data.data
  if (plans.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="No Credit plans on sale right now"
        description="Check back soon. Credits you already have stay in your balance."
      />
    )
  }

  const values = describePlanValues(plans)

  return (
    <section aria-label="Credit plans" className="space-y-4">
      {checkout.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-destructive/5 px-4 py-3 text-sm text-foreground ring-1 ring-destructive/20"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-destructive"
            aria-hidden
          />
          <span>
            {checkout.error === 'planInactive'
              ? 'That plan is no longer for sale. Pick another plan below.'
              : "We couldn't open checkout, and nothing was charged. Please try again."}
          </span>
        </p>
      )}
      <ul
        className="grid grid-cols-1 items-stretch gap-x-6 gap-y-8 pt-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
      >
        {plans.map((plan, index) => (
          <li key={plan.id} className="flex">
            <div className="flex w-full flex-col *:flex-1">
              <PricingPlanCard
                plan={plan}
                value={values.get(plan.id)}
                buyNoteId={BUY_NOTE_ID}
                index={index}
                onBuy={() => checkout.buy(plan.id)}
                buying={checkout.buyingPlanId === plan.id}
                disabled={checkout.buyingPlanId !== null}
              />
            </div>
          </li>
        ))}
      </ul>
      <p id={BUY_NOTE_ID} className="text-sm text-muted-foreground">
        Prices are in {plans[0].currency.toUpperCase()} and charged once through
        Stripe&rsquo;s secure checkout, which also emails your receipt.{' '}
        <a
          href={`#${FIELD_COSTS_ID}`}
          className="font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
        >
          See what each field costs
        </a>
      </p>
    </section>
  )
}

function PlanGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-x-6 gap-y-8 pt-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading Credit plans"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-[1.25rem] bg-muted/50 p-1.5 ring-1 ring-border/70"
        >
          <div className="space-y-6 rounded-[calc(1.25rem-0.375rem)] bg-card p-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-12 w-40" />
            <div className="space-y-2 border-t border-border/70 pt-5">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
