import { usePostHog } from '@posthog/react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { useRequestReportUploadDownload } from '@/apis/requests/get-request-report-upload-download-url'
import { formatUsd } from '@/lib/request-display'
import { cn } from '@/lib/utils'
import { REQUEST_REPORT_STATUS } from '@/types/request'
import type { RequestDetailLine } from './build-request-detail-groups'

type RequestDetailLineRowProps = {
  line: RequestDetailLine
  /** The Request is paid and being worked on, so pending lines are in progress. */
  inProgress: boolean
}

function LineStatus({
  line,
  inProgress,
}: RequestDetailLineRowProps): React.ReactNode {
  if (line.refundDue) {
    return (
      <span className="text-sky-800 dark:text-sky-300">
        Unavailable · refund of {formatUsd(line.price)} due
      </span>
    )
  }
  if (line.rejected) return <span>Unavailable · not charged</span>
  if (line.status === REQUEST_REPORT_STATUS.DELIVERED) {
    return (
      <span className="text-emerald-700 dark:text-emerald-300">
        Delivered
        {line.uploadId == null && (
          <span className="text-muted-foreground"> · file on its way</span>
        )}
      </span>
    )
  }
  if (inProgress) return <span>In progress</span>
  return null
}

export function RequestDetailLineRow({
  line,
  inProgress,
}: RequestDetailLineRowProps) {
  const posthog = usePostHog()
  const { mutate: download, isPending: isDownloading } =
    useRequestReportUploadDownload()
  const showFinal =
    !line.rejected &&
    line.finalPrice != null &&
    line.estimatedPrice > 0 &&
    line.estimatedPrice !== line.finalPrice

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5 sm:flex-nowrap">
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium text-foreground',
            line.rejected && 'text-muted-foreground line-through',
          )}
        >
          {line.reportName}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <LineStatus line={line} inProgress={inProgress} />
        </p>
      </div>

      <div className="text-right text-sm tabular-nums">
        <span
          className={cn(
            'font-medium',
            line.rejected && 'text-muted-foreground line-through',
          )}
        >
          {formatUsd(line.price)}
        </span>
        {showFinal && (
          <span className="block text-xs text-muted-foreground line-through">
            {formatUsd(line.estimatedPrice)}
          </span>
        )}
        {line.finalPrice == null && !line.rejected && (
          <span className="block text-xs text-muted-foreground">estimate</span>
        )}
      </div>

      {line.uploadId != null && !line.rejected && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full gap-1.5 sm:w-auto"
          disabled={isDownloading}
          aria-label={`Download ${line.reportName}`}
          onClick={() =>
            download(line.uploadId, {
              onSuccess: () => {
                posthog.capture('request_report_downloaded', {
                  report_id: line.reportId,
                })
              },
              onError: () => {
                toast.error('Could not download the report. Please try again.')
              },
            })
          }
        >
          {isDownloading ? (
            <Loader2 aria-hidden className="size-3.5 animate-spin" />
          ) : (
            <Download aria-hidden className="size-3.5" />
          )}
          Download
        </Button>
      )}
    </li>
  )
}
