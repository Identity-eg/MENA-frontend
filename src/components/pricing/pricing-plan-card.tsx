import { Coins, Loader2, Sparkles } from 'lucide-react'

import type { TCreditPlan } from '@/types/credits'
import type { PlanValue } from '@/lib/credit-plans'
import { Button } from '@/components/ui/button'

import { formatPlanPrice } from '@/lib/credit-plans'
import { cn } from '@/lib/utils'

const creditNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

type PricingPlanCardProps = {
  plan: TCreditPlan
  value: PlanValue | undefined
  /** Id of the note on how plans are charged, read with the Buy button. */
  buyNoteId: string
  /** Starts Stripe checkout for this plan. */
  onBuy: () => void
  /** This plan's checkout is being opened. */
  buying: boolean
  /** Another plan's checkout is being opened. */
  disabled: boolean
  /** Position in the grid, for a staggered entrance. */
  index: number
}

/**
 * One Credit plan: Credits as the headline number, the one-time price beneath, and what a
 * Credit costs on this plan. A plan with a badge sits in a raised, tinted frame.
 */
export function PricingPlanCard({
  plan,
  value,
  buyNoteId,
  onBuy,
  buying,
  disabled,
  index,
}: PricingPlanCardProps) {
  const featured = plan.badge !== null
  const titleId = `plan-${plan.id}-name`

  return (
    <article
      aria-labelledby={titleId}
      style={{ animationDelay: `${index * 70}ms` }}
      className={cn(
        'group relative flex flex-col rounded-[1.25rem] p-1.5 ring-1 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-700',
        featured
          ? 'bg-primary/10 ring-primary/25 shadow-[0_24px_48px_-24px_color-mix(in_oklab,var(--primary)_45%,transparent)] lg:-translate-y-2 dark:bg-primary/15 dark:ring-primary/35'
          : 'bg-muted/50 ring-border/70 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_color-mix(in_oklab,var(--foreground)_30%,transparent)]',
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold whitespace-nowrap text-primary-foreground shadow-sm">
          <Sparkles className="size-3.5" strokeWidth={1.75} aria-hidden />
          <span>{plan.badge}</span>
        </div>
      )}

      <div
        className={cn(
          'flex flex-1 flex-col rounded-[calc(1.25rem-0.375rem)] bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
        )}
      >
        <div className="space-y-1.5">
          <h2 id={titleId} className="text-base font-semibold text-foreground">
            {plan.name}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {plan.description}
          </p>
        </div>

        <div className="mt-8 flex items-end gap-2">
          <Coins
            className={cn(
              'mb-2 size-6 shrink-0',
              featured ? 'text-primary' : 'text-muted-foreground',
            )}
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight text-foreground tabular-nums">
              {creditNumber.format(plan.credits)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {plan.credits === 1 ? 'credit' : 'credits'}
            </span>
          </p>
        </div>

        <dl className="mt-6 space-y-2 border-t border-border/70 pt-5 text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">One-time price</dt>
            <dd className="text-lg font-semibold text-foreground tabular-nums">
              {formatPlanPrice(plan.priceCents)}
            </dd>
          </div>
          {value && (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="sr-only">Value</dt>
              <dd className="text-muted-foreground tabular-nums">
                {value.perCredit}
              </dd>
              {value.savingPercent !== null && (
                <dd className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Save {value.savingPercent}%
                </dd>
              )}
            </div>
          )}
        </dl>

        <div className="mt-auto pt-8">
          <Button
            size="lg"
            variant={featured ? 'default' : 'outline'}
            className="min-h-11 w-full gap-2 text-sm active:scale-[0.98]"
            disabled={buying || disabled}
            aria-describedby={buyNoteId}
            onClick={onBuy}
          >
            {buying && (
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden
              />
            )}
            {buying ? 'Opening secure checkout' : `Buy ${plan.name}`}
          </Button>
        </div>
      </div>
    </article>
  )
}
