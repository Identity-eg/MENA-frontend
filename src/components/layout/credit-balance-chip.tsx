import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Coins } from 'lucide-react'

import { getCreditBalanceQueryOptions } from '@/apis/credits/get-credit-balance'
import { formatCreditCount, formatCredits } from '@/lib/credits'
import { cn } from '@/lib/utils'

/**
 * The Credit balance in the top bar, linking to the Credits page. Read from the server only;
 * it refreshes when the balance query is invalidated, and announces changes politely.
 */
export function CreditBalanceChip() {
  const { data, isPending, isError } = useQuery(getCreditBalanceQueryOptions())
  const balance = data?.data.balance

  const label = balance === undefined ? null : formatCredits(balance)

  return (
    <>
      <Link
        to="/credits"
        className="group inline-flex h-11 shrink-0 items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-full bg-primary/8 pr-3 pl-1.5 text-sm font-medium whitespace-nowrap sm:pr-3.5 text-foreground ring-1 ring-primary/15 ring-inset',
            'transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-primary/12 group-active:scale-[0.97]',
          )}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Coins className="size-3.5" strokeWidth={1.75} aria-hidden />
          </span>
          {isPending ? (
            <>
              <span className="sr-only">Credits</span>
              <span
                className="h-3.5 w-10 animate-pulse rounded-full bg-primary/15 sm:w-20"
                aria-hidden
              />
            </>
          ) : isError || label === null ? (
            <span>Credits</span>
          ) : (
            <span className="tabular-nums">
              <span className="sr-only">Credit balance: </span>
              {/* Phones: the number only, the coin says "Credits" (the full label stays for screen readers). */}
              <span className="sm:hidden" aria-hidden>
                {formatCreditCount(balance!)}
              </span>
              <span className="sr-only sm:not-sr-only">{label}</span>
            </span>
          )}
        </span>
      </Link>
      {/* Announces balance changes (e.g. after an Unlock); the first value is not read out. */}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic>
        {label ? `Credit balance ${label}` : ''}
      </span>
    </>
  )
}
