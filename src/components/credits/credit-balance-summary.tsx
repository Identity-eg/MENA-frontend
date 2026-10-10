import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Coins } from 'lucide-react'

import { formatCredits } from '@/lib/credits'

/** The Credit balance at the top of the Credits page, with the way to get more. */
export function CreditBalanceSummary({ balance }: { balance: number }) {
  return (
    <section
      aria-labelledby="credit-balance-heading"
      className="rounded-2xl bg-primary/5 p-1.5 ring-1 ring-primary/10"
    >
      <div className="flex flex-col gap-5 rounded-[calc(1rem-0.375rem)] bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Coins className="size-6" strokeWidth={1.5} aria-hidden />
          </div>
          <div className="space-y-1">
            <h2
              id="credit-balance-heading"
              className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase"
            >
              Credit balance
            </h2>
            <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums sm:text-4xl">
              {formatCredits(balance)}
            </p>
          </div>
        </div>
        <Link
          to="/pricing"
          className="group inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-primary py-2 ps-5 pe-2 text-sm font-medium text-primary-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:scale-[0.98] sm:self-center"
        >
          Get more Credits
          <span className="flex size-7 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
        </Link>
      </div>
    </section>
  )
}
