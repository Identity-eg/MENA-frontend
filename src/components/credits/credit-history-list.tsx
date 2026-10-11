import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  KeyRound,
  
  PackagePlus,
  SlidersHorizontal,
  Undo2
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';

import type {
  TCreditTransaction,
  TCreditTransactionType,
} from '@/types/credits'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  CREDIT_TRANSACTION_TYPE_LABELS,
  describeCreditTransaction,
  formatSignedCredits,
} from '@/lib/credit-history'
import { formatCredits } from '@/lib/credits'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<TCreditTransactionType, LucideIcon> = {
  GRANT: PackagePlus,
  SPEND: KeyRound,
  REFUND: Undo2,
  ADJUSTMENT: SlidersHorizontal,
}

const occurredAt = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function TypeLabel({ type }: { type: TCreditTransactionType }) {
  const Icon = TYPE_ICONS[type]
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
        <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      </span>
      {CREDIT_TRANSACTION_TYPE_LABELS[type]}
    </span>
  )
}

function SignedAmount({ amount }: { amount: number }) {
  return (
    <span
      className={cn(
        'font-semibold tabular-nums',
        amount > 0
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-foreground',
      )}
    >
      {formatSignedCredits(amount)}
    </span>
  )
}

function Description({ tx }: { tx: TCreditTransaction }) {
  const { summary, reason, company } = describeCreditTransaction(tx)
  return (
    <div className="min-w-0 space-y-0.5">
      <p className="text-sm text-foreground wrap-break-word">{summary}</p>
      {company && (
        <Link
          to="/companies/$companyId"
          params={{ companyId: String(company.id) }}
          className="inline-flex min-h-11 items-center gap-1 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span dir="auto" className="wrap-break-word">
            {company.name}
          </span>
          <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
        </Link>
      )}
      {reason && (
        <p className="text-xs text-muted-foreground wrap-break-word">
          <span className="font-medium">Reason:</span> {reason}
        </p>
      )}
    </div>
  )
}

function OccurredAt({ createdAt }: { createdAt: string }) {
  return (
    <time dateTime={createdAt} className="whitespace-nowrap">
      {occurredAt.format(new Date(createdAt))}
    </time>
  )
}

/** Credit transactions as a table on wide screens and a stacked list on phones. */
export function CreditHistoryList({
  transactions,
}: {
  transactions: Array<TCreditTransaction>
}) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-36">Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-44">Date</TableHead>
              <TableHead className="w-32 text-end">Amount</TableHead>
              <TableHead className="w-36 text-end">Balance after</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="align-top">
                  <TypeLabel type={tx.type} />
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <Description tx={tx} />
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground">
                  <OccurredAt createdAt={tx.createdAt} />
                </TableCell>
                <TableCell className="align-top text-end">
                  <SignedAmount amount={tx.amount} />
                </TableCell>
                <TableCell className="align-top text-end text-sm text-muted-foreground tabular-nums">
                  {formatCredits(tx.balanceAfter)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="divide-y md:hidden">
        {transactions.map((tx) => (
          <li key={tx.id} className="space-y-3 py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <TypeLabel type={tx.type} />
              <SignedAmount amount={tx.amount} />
            </div>
            <Description tx={tx} />
            <dl className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                <dt className="sr-only">Date</dt>
                <dd>
                  <OccurredAt createdAt={tx.createdAt} />
                </dd>
              </div>
              <div className="flex gap-1">
                <dt>Balance after</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {formatCredits(tx.balanceAfter)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}

/** Placeholder rows matching the list's shape while the history loads. */
export function CreditHistorySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading Credit history"
      className="space-y-1"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b py-4 last:border-b-0"
        >
          <Skeleton className="size-7 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
