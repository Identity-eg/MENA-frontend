import {
  ArrowDown,
  Clock,
  CreditCard,
  FileDown,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { memo, type ReactNode } from 'react'

import { StatusPill } from '@/components/StatusPill'
import { Button, buttonVariants } from '@/components/ui/button'

import type { InvoiceDisplay } from '@/lib/request-billing'
import { formatUsd } from '@/lib/request-display'
import type { NextStep } from '@/lib/request-next-step'
import { cn } from '@/lib/utils'
import type { RequestStatusValue } from '@/types/request'
import { getNextStepCopy } from './request-next-step-label'

export type PaymentProcessingState = {
  /** Polling gave up before the payment was confirmed. */
  delayed: boolean
  isChecking: boolean
  onCheckAgain: () => void
}

type RequestDetailHeroProps = {
  formattedId: string
  status: RequestStatusValue
  nextStep: NextStep
  /** "2 reports · 1 company · Submitted Oct 3, 2026" */
  meta: string
  totalEstimatedPrice: number
  /** Derived from request.status + invoice.status (see lib/request-billing). */
  invoiceDisplay: InvoiceDisplay
  canDownloadInvoice: boolean
  /** Payable and no payment currently being confirmed. */
  canPay: boolean
  /** Returned from Stripe; waiting for the payment webhook to land. */
  paymentProcessing: PaymentProcessingState | null
  isPaymentRedirecting: boolean
  isDownloadingInvoice: boolean
  onDownloadInvoice: () => void
  onPay: () => void
  /** The owner's Cancel request button, when allowed. */
  cancelAction?: ReactNode
}

/** One amount: the invoice once there is one, the estimate before that. */
function AmountBlock({
  display,
  estimate,
}: {
  display: InvoiceDisplay
  estimate: number
}) {
  const invoiced =
    display.kind === 'due' ||
    display.kind === 'paid' ||
    display.kind === 'issued'
  const label =
    display.kind === 'due'
      ? display.overdue
        ? 'Amount due · overdue'
        : 'Amount due'
      : display.kind === 'paid'
        ? 'Paid'
        : display.kind === 'issued'
          ? 'Invoiced'
          : 'Estimated total'
  const amount = invoiced ? display.amount : estimate

  return (
    <div className="sm:text-right">
      <p
        className={cn(
          'text-xs text-muted-foreground',
          display.kind === 'due' &&
            display.overdue &&
            'font-medium text-red-700 dark:text-red-300',
        )}
      >
        {label}
      </p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {formatUsd(amount)}
      </p>
      {invoiced && estimate > 0 && estimate !== display.amount && (
        <p className="text-xs text-muted-foreground tabular-nums">
          Estimated <span className="line-through">{formatUsd(estimate)}</span>
        </p>
      )}
      {display.kind === 'withdrawn' && (
        <p className="text-xs text-muted-foreground">Invoice withdrawn</p>
      )}
    </div>
  )
}

const stepTone: Record<NextStep['kind'], string> = {
  review: 'bg-muted text-muted-foreground',
  'invoice-pending': 'bg-muted text-muted-foreground',
  pay: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  'in-progress': 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300',
  download:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
  cancelled: 'bg-muted text-muted-foreground',
}

export const RequestDetailHero = memo(function RequestDetailHero({
  formattedId,
  status,
  nextStep,
  meta,
  totalEstimatedPrice,
  invoiceDisplay,
  canDownloadInvoice,
  canPay,
  paymentProcessing,
  isPaymentRedirecting,
  isDownloadingInvoice,
  onDownloadInvoice,
  onPay,
  cancelAction,
}: RequestDetailHeroProps) {
  const copy = paymentProcessing
    ? {
        ...getNextStepCopy(nextStep),
        icon: paymentProcessing.delayed ? Clock : Loader2,
        label: 'Confirming your payment',
        description: paymentProcessing.delayed
          ? 'Confirmation is taking longer than usual. You do not need to pay again — this page updates once the payment is confirmed.'
          : 'We are confirming your payment with our payment provider. This usually takes a few seconds.',
      }
    : getNextStepCopy(nextStep)
  const Icon = copy.icon
  const tone = paymentProcessing
    ? stepTone['in-progress']
    : stepTone[nextStep.kind]

  return (
    <header className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight tabular-nums">
              {formattedId}
            </h1>
            <StatusPill status={status} />
          </div>
          <p className="text-sm text-muted-foreground">{meta}</p>
        </div>
        <AmountBlock display={invoiceDisplay} estimate={totalEstimatedPrice} />
      </div>

      <div
        role="status"
        aria-live="polite"
        className="flex flex-col gap-4 border-t bg-muted/40 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg',
              tone,
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                'size-4.5',
                paymentProcessing &&
                  !paymentProcessing.delayed &&
                  'animate-spin motion-reduce:animate-none',
              )}
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {nextStep.kind === 'rejected' || nextStep.kind === 'cancelled'
                ? 'Status'
                : 'Next step'}
            </p>
            <p className="font-medium text-foreground">{copy.label}</p>
            <p className="mt-0.5 max-w-prose text-sm text-pretty text-muted-foreground">
              {copy.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end">
          {cancelAction}
          {canDownloadInvoice && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-2"
              disabled={isDownloadingInvoice}
              onClick={onDownloadInvoice}
            >
              {isDownloadingInvoice ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <FileDown aria-hidden className="size-4" />
              )}
              Invoice PDF
            </Button>
          )}
          {paymentProcessing?.delayed && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              disabled={paymentProcessing.isChecking}
              onClick={paymentProcessing.onCheckAgain}
            >
              {paymentProcessing.isChecking ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <RefreshCw aria-hidden className="size-4" />
              )}
              Check again
            </Button>
          )}
          {canPay && invoiceDisplay.kind === 'due' && (
            <Button
              size="lg"
              className="w-full gap-2 px-4 hover:bg-primary/90 active:translate-y-px sm:w-auto"
              disabled={isPaymentRedirecting}
              onClick={onPay}
            >
              {isPaymentRedirecting ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <CreditCard aria-hidden className="size-4" />
              )}
              Pay {formatUsd(invoiceDisplay.amount)}
            </Button>
          )}
          {nextStep.kind === 'download' && (
            <a
              href="#request-reports"
              className={buttonVariants({
                size: 'lg',
                className: 'w-full gap-2 px-4 sm:w-auto',
              })}
            >
              <ArrowDown aria-hidden className="size-4" />
              Go to reports
            </a>
          )}
        </div>
      </div>
    </header>
  )
})
