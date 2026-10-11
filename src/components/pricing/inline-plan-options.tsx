import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react'

import type {ReturnTarget} from '@/lib/plan-checkout';
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { getCreditPlansQueryOptions } from '@/apis/credits/get-credit-plans'
import { usePlanCheckout } from '@/apis/credits/start-plan-checkout'
import { formatPlanPrice, smallestPlanCovering } from '@/lib/credit-plans'
import { formatCredits } from '@/lib/credits'
import {  returnToPath } from '@/lib/plan-checkout'
import { cn } from '@/lib/utils'

type InlinePlanOptionsProps = {
  /** Credits the user is short; the smallest plan covering it is suggested. */
  shortfall: number
  /** Where to land after paying, e.g. the company being unlocked. */
  returnTo: ReturnTarget
}

/**
 * Compact Credit plan cards for buying without leaving the current task (the insufficient-Credits
 * panel). Buy goes straight to Stripe checkout and comes back to `returnTo`.
 */
export function InlinePlanOptions({
  shortfall,
  returnTo,
}: InlinePlanOptionsProps) {
  const plans = useQuery(getCreditPlansQueryOptions())
  const checkout = usePlanCheckout(returnTo)
  const buyingPlanId = checkout.buyingPlanId

  const allPlansLink = (
    <Link
      to="/pricing"
      search={{ returnTo: returnToPath(returnTo) }}
      className="group inline-flex min-h-11 items-center gap-1 self-start rounded-lg text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      Compare all plans
      <ArrowUpRight
        className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      />
    </Link>
  )

  if (plans.isPending) {
    return (
      <ul className="space-y-2" aria-label="Loading Credit plans">
        {[0, 1].map((i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 rounded-xl bg-card p-3 ring-1 ring-border/70"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-11 w-24 rounded-lg" />
          </li>
        ))}
      </ul>
    )
  }

  if (plans.isError || plans.data.data.length === 0) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          {plans.isError
            ? "We couldn't load the Credit plans here."
            : 'No Credit plans are on sale right now.'}
        </p>
        {allPlansLink}
      </div>
    )
  }

  const suggested = smallestPlanCovering(plans.data.data, shortfall)

  return (
    <div className="flex flex-col gap-2">
      {checkout.error && (
        <p
          role="alert"
          className="flex items-start gap-2 text-xs text-destructive"
        >
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
          {checkout.error === 'planInactive'
            ? 'That plan is no longer for sale. Pick another one.'
            : "We couldn't open checkout, and nothing was charged. Please try again."}
        </p>
      )}
      <ul className="space-y-2" aria-label="Credit plans">
        {plans.data.data.map((plan) => {
          const isSuggested = plan.id === suggested
          const covers = plan.credits >= shortfall
          const buying = buyingPlanId === plan.id
          const price = formatPlanPrice(plan.priceCents, plan.currency)
          return (
            <li
              key={plan.id}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl bg-card p-3 ring-1 transition-shadow duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                isSuggested
                  ? 'ring-primary/35 shadow-[0_10px_24px_-18px_color-mix(in_oklab,var(--primary)_60%,transparent)]'
                  : 'ring-border/70',
              )}
            >
              <div className="min-w-0 space-y-0.5">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-semibold text-foreground">
                  <span className="tabular-nums">
                    {formatCredits(plan.credits)}
                  </span>
                  {isSuggested ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      Covers what you need
                    </span>
                  ) : (
                    plan.badge && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {plan.badge}
                      </span>
                    )
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {plan.name}, {price} once
                  {!covers && (
                    <span className="sr-only">
                      , not enough on its own for this Unlock
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant={isSuggested ? 'default' : 'secondary'}
                size="lg"
                onClick={() => checkout.buy(plan.id)}
                disabled={buyingPlanId !== null}
                aria-label={`Buy ${plan.name}, ${formatCredits(plan.credits)} for ${price}`}
                className={cn(
                  'min-h-11 gap-1.5 px-4 active:scale-[0.98]',
                  isSuggested && 'hover:bg-primary/90',
                )}
              >
                {buying && (
                  <Loader2
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden
                  />
                )}
                {buying ? 'Opening' : `Buy ${price}`}
              </Button>
            </li>
          )
        })}
      </ul>
      {allPlansLink}
    </div>
  )
}
