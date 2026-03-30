import { memo } from 'react'
import { CreditCard, FileDown, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/StatusPill'
import type { RequestStatusValue } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'
import type { TRequestInvoice } from '@/types/request'

type RequestDetailHeroProps = {
  formattedId: string
  status: RequestStatusValue
  subjectsCount: number
  submittedDate: string
  totalEstimatedPrice: number
  amountDue: number
  invoice: TRequestInvoice | null | undefined
  isPaymentRedirecting: boolean
  onDownloadInvoice: () => void
  onPay: () => void
}

export const RequestDetailHero = memo(function RequestDetailHero({
  formattedId,
  status,
  subjectsCount,
  submittedDate,
  totalEstimatedPrice,
  amountDue,
  invoice,
  isPaymentRedirecting,
  onDownloadInvoice,
  onPay,
}: RequestDetailHeroProps) {
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
          {(invoice != null || status === REQUEST_STATUS.INVOICE_GENERATED) && (
            <div className="flex items-center gap-2">
              {invoice != null && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none gap-2"
                  onClick={onDownloadInvoice}
                >
                  <FileDown className="h-4 w-4" />
                  Download Invoice
                </Button>
              )}
              {status === REQUEST_STATUS.INVOICE_GENERATED && (
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
                  Pay ${amountDue.toLocaleString()}
                </Button>
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
            {invoice != null && (
              <div className="flex-1 sm:flex-none rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Amount due
                </p>
                <p className="text-base font-bold tabular-nums tracking-tight text-primary">
                  ${invoice.amount.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
})
