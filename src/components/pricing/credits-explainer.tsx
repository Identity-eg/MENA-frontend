import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Coins, Layers, LockOpen } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

import { getFieldCostsQueryOptions } from '@/apis/credits/get-field-costs'
import { formatCredits } from '@/lib/credits'

const STEPS = [
  {
    icon: Layers,
    title: 'Buy a plan once',
    body: 'Each plan is a one-time payment, not a subscription. Credits never expire and add up every time you buy.',
  },
  {
    icon: LockOpen,
    title: 'Unlock the fields you need',
    body: 'Spend Credits to Unlock a Sensitive field of any company. A field costs the same for every company.',
  },
  {
    icon: Coins,
    title: 'Keep it for good',
    body: 'An Unlock is permanent. Opening a field you already unlocked never costs Credits again.',
  },
] as const

export const FIELD_COSTS_ID = 'field-costs'

/** How Credits work, next to the current Field cost of each Sensitive field. */
export function CreditsExplainer() {
  const { data, isPending, isError, refetch } = useQuery(
    getFieldCostsQueryOptions(),
  )
  const fieldCosts = data?.data ?? []

  return (
    <section
      aria-labelledby="how-credits-work"
      className="grid gap-10 rounded-2xl bg-muted/40 p-6 ring-1 ring-border/60 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14"
    >
      <div>
        <h2
          id="how-credits-work"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          How Credits work
        </h2>
        <ol className="mt-6 space-y-6">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary ring-1 ring-border/70">
                <Icon className="size-5" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div id={FIELD_COSTS_ID} className="scroll-mt-24">
        <h2 className="text-sm font-semibold text-foreground">Field costs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What one Unlock costs, for any company.
        </p>
        <div className="mt-4 rounded-xl bg-card ring-1 ring-border/70">
          {isPending ? (
            <ul
              className="divide-y divide-border/70"
              aria-label="Loading Field costs"
            >
              {[0, 1, 2, 3].map((i) => (
                <li
                  key={i}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="text-muted-foreground" role="alert">
                Couldn&rsquo;t load Field costs.
              </span>
              <button
                type="button"
                onClick={() => refetch()}
                className="min-h-11 rounded-lg px-3 font-medium text-primary outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Try again
              </button>
            </div>
          ) : fieldCosts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No fields can be unlocked right now.
            </p>
          ) : (
            <ul className="divide-y divide-border/70">
              {fieldCosts.map((field) => (
                <li
                  key={field.key}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <span className="text-foreground">{field.label}</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {formatCredits(field.cost)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link
          to="/companies"
          className="group mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-medium text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Find a company to unlock
          <ArrowRight
            className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  )
}
