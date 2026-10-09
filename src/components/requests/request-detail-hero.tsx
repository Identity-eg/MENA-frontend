import { CreditCard, FileDown, FileText, Loader2 } from 'lucide-react'
import { memo, type ReactNode } from 'react'

import { StatusPill } from '@/components/StatusPill'
import { Button } from '@/components/ui/button'

import type { InvoiceDisplay } from '@/lib/request-billing'
import { cn } from '@/lib/utils'
import type { RequestStatusValue } from '@/types/request'

type RequestDetailHeroProps = {
  formattedId: string
  status: RequestStatusValue
  subjectsCount: number
  submittedDate: string
  totalEstimatedPrice: number
  /** Derived from request.status + invoice.status (see lib/request-billing). */
  invoiceDisplay: InvoiceDisplay
  canDownloadInvoice: boolean
  /** Payable and no payment currently being confirmed. */
  canPay: boolean
  /** Returned from Stripe; waiting for the payment webhook to land. */
  isPaymentProcessing: boolean
  isPaymentRedirecting: boolean
  isDownloadingInvoice: boolean
  onDownloadInvoice: () => void
  onPay: () => void
  /** Extra action (e.g. the owner's Cancel request button). */
  cancelAction?: ReactNode
}

function InvoiceAmountTile({ display }: { display: InvoiceDisplay }) {
  if (display.kind === 'none') return null

  if (display.kind === 'withdrawn') {
    return (
      <div className="flex-1 sm:flex-none rounded-lg border border-dashed px-3 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Invoice
        </p>
        <p className="text-sm font-semibold text-muted-foreground">
          Invoice withdrawn
        </p>
      </div>
    )
  }

  const label =
    display.kind === 'due'
      ? display.overdue
        ? 'Amount due · Overdue'
        : 'Amount due'
      : display.kind === 'paid'
        ? 'Paid'
        : 'Invoice'

  return (
    <div
      className={cn(
        'flex-1 sm:flex-none rounded-lg border px-3 py-2',
        display.kind === 'due' && 'border-primary/30 bg-primary/5',
        display.kind === 'paid' &&
          'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10',
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'text-base font-bold tabular-nums tracking-tight',
          display.kind === 'due' && 'text-primary',
          display.kind === 'paid' && 'text-emerald-700 dark:text-emerald-400',
        )}
      >
        ${display.amount.toLocaleString()}
      </p>
    </div>
  )
}

export const RequestDetailHero = memo(function RequestDetailHero({
  formattedId,
  status,
  subjectsCount,
  submittedDate,
  totalEstimatedPrice,
  invoiceDisplay,
  canDownloadInvoice,
  canPay,
  isPaymentProcessing,
  isPaymentRedirecting,
  isDownloadingInvoice,
  onDownloadInvoice,
  onPay,
  cancelAction,
}: RequestDetailHeroProps) {
  const hasActions =
    canDownloadInvoice || canPay || isPaymentProcessing || cancelAction != null

  return (
    <header className="relative overflow-hidden rounded-xl sm:rounded-2xl border bg-linear-to-br from-card via-card to-muted/30 px-4 py-5 shadow-sm sm:px-8 sm:py-7">
      <div className="absolute right-0 top-0 h-24 w-40 bg-linear-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight sm:text-2xl lg:text-3xl truncate">
              {formattedId}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <StatusPill status={status} className="shrink-0" />
              <span className="text-xs text-muted-foreground">
                {subjectsCount > 0
                  ? `${subjectsCount} subject${subjectsCount === 1 ? '' : 's'} · ${submittedDate}`
                  : submittedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {hasActions && (
            <div className="flex flex-wrap items-center gap-2">
              {cancelAction}
              {canDownloadInvoice && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none gap-2"
                  disabled={isDownloadingInvoice}
                  onClick={onDownloadInvoice}
                >
                  {isDownloadingInvoice ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )}
                  Download Invoice
                </Button>
              )}
              {isPaymentProcessing ? (
                <span
                  role="status"
                  className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Payment processing
                </span>
              ) : (
                canPay &&
                invoiceDisplay.kind === 'due' && (
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-none gap-2 bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500 border-none shadow-sm"
                    disabled={isPaymentRedirecting}
                    onClick={onPay}
                  >
                    {isPaymentRedirecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}{' '}
                    Pay ${invoiceDisplay.amount.toLocaleString()}
                  </Button>
                )
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 sm:flex-none rounded-lg border px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Estimated
              </p>
              <p className="text-base font-bold tabular-nums tracking-tight">
                ${totalEstimatedPrice.toLocaleString()}
              </p>
            </div>
            <InvoiceAmountTile display={invoiceDisplay} />
          </div>
        </div>
      </div>
    </header>
  )
})
