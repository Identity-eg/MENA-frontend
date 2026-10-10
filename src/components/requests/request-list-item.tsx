import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { StatusPill } from '@/components/StatusPill'

import { getInvoiceDisplay, requestHasRefundDue } from '@/lib/request-billing'
import {
  formatRequestId,
  formatUsd,
  getRequestCompanies,
  summarizeCompanies,
} from '@/lib/request-display'
import { getNextStep } from '@/lib/request-next-step'
import type { TRequest } from '@/types/request'
import { formatRequestDate } from './request-detail-formatters'
import { RequestNextStepLabel } from './request-next-step-label'

/** Column template shared by the header row and every item (md and up). */
export const REQUEST_LIST_COLUMNS =
  'md:grid md:grid-cols-[9rem_minmax(0,1.4fr)_minmax(0,1.6fr)_7rem_1rem] md:items-center md:gap-6'

/** Invoice amount once invoiced, otherwise the estimate. */
function getAmount(request: TRequest) {
  const invoice = getInvoiceDisplay(request)
  switch (invoice.kind) {
    case 'due':
      return {
        value: invoice.amount,
        note: invoice.overdue ? 'overdue' : 'due',
      }
    case 'paid':
      return { value: invoice.amount, note: 'paid' }
    case 'issued':
      return { value: invoice.amount, note: 'invoiced' }
    default:
      return { value: request.totalEstimatedPrice, note: 'estimate' }
  }
}

export function RequestListHeader() {
  return (
    <div
      aria-hidden
      className={`hidden px-4 pb-2 text-xs font-medium text-muted-foreground sm:px-5 ${REQUEST_LIST_COLUMNS}`}
    >
      <span>Request</span>
      <span>Companies</span>
      <span>Next step</span>
      <span className="text-right">Amount</span>
      <span />
    </div>
  )
}

export function RequestListItem({ request }: { request: TRequest }) {
  const companies = getRequestCompanies(request)
  const lineCount = request.requestReports?.length ?? 0
  const amount = getAmount(request)
  const formattedId = formatRequestId(request.id)

  return (
    <li>
      <Link
        to="/requests/$requestId"
        params={{ requestId: String(request.id) }}
        aria-label={`${formattedId}, ${summarizeCompanies(companies)}`}
        className={`group flex flex-col gap-3 px-4 py-4 outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-5 ${REQUEST_LIST_COLUMNS}`}
      >
        <div className="flex items-center justify-between gap-3 md:block">
          <div>
            <p className="text-sm font-medium tabular-nums text-foreground">
              {formattedId}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatRequestDate(request.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 md:hidden">
            <StatusPill status={request.status} />
          </div>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">
            {summarizeCompanies(companies)}
          </p>
          <p className="text-xs text-muted-foreground">
            {lineCount} report{lineCount === 1 ? '' : 's'}
            {requestHasRefundDue(request) && (
              <span className="text-sky-800 dark:text-sky-300">
                {' '}
                · refund due
              </span>
            )}
          </p>
        </div>

        {/* One line on mobile; two grid cells from md up. */}
        <div className="flex items-start justify-between gap-3 md:contents">
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            <span className="hidden md:inline-flex">
              <StatusPill status={request.status} />
            </span>
            <RequestNextStepLabel step={getNextStep(request)} />
          </div>

          <div className="shrink-0 text-right">
            <span>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {formatUsd(amount.value)}
              </span>
              <span
                className={`block text-xs ${amount.note === 'overdue' ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'}`}
              >
                {amount.note}
              </span>
            </span>
          </div>
        </div>

        <ChevronRight
          aria-hidden
          className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block"
        />
      </Link>
    </li>
  )
}
