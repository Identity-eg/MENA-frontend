import { Clock, Loader2, RefreshCw } from 'lucide-react'
import { memo } from 'react'

import { Button } from '@/components/ui/button'

type RequestDetailPaymentProcessingBannerProps = {
  /** Polling gave up before the payment was confirmed. */
  delayed: boolean
  isChecking: boolean
  onCheckAgain: () => void
}

export const RequestDetailPaymentProcessingBanner = memo(
  function RequestDetailPaymentProcessingBanner({
    delayed,
    isChecking,
    onCheckAgain,
  }: RequestDetailPaymentProcessingBannerProps) {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
      >
        <div className="flex items-center gap-3">
          {delayed ? (
            <Clock className="h-5 w-5 shrink-0" />
          ) : (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
          )}
          <div>
            <p className="font-medium">Payment processing</p>
            <p className="text-xs opacity-90">
              {delayed
                ? 'Confirmation is taking longer than usual. You do not need to pay again; this page will update once the payment is confirmed.'
                : 'We are confirming your payment with our payment provider. This usually takes a few seconds.'}
            </p>
          </div>
        </div>
        {delayed && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-2"
            disabled={isChecking}
            onClick={onCheckAgain}
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Check again
          </Button>
        )}
      </div>
    )
  },
)
