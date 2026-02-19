import { Activity, Download, Loader2 } from 'lucide-react'
import type {
  RequestReportStatusValue,
  RequestStatusValue,
} from '@/types/request'
import { REQUEST_REPORT_STATUS, REQUEST_STATUS } from '@/types/request'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRequestReportUploadDownload } from '@/apis/requests/get-request-report-upload-download-url'
import { cn } from '@/lib/utils'

export type RequestReportRowReport = {
  id: number
  name: string
  price?: number
  estimatedPrice?: number
  upload?: { id: number } | null
  /** Request-report-level status */
  reportStatus?: RequestReportStatusValue
  /** Request-report-level final price (overrides price when set) */
  finalPrice?: number | null
}

type RequestReportRowProps = {
  report: RequestReportRowReport
  status: RequestStatusValue
}

const reportStatusVariant: Record<
  RequestReportStatusValue,
  'secondary' | 'default' | 'outline'
> = {
  [REQUEST_REPORT_STATUS.UNDER_REVIEW]: 'secondary',
  [REQUEST_REPORT_STATUS.PROCESSING]: 'default',
  [REQUEST_REPORT_STATUS.COMPLETED]: 'default',
  [REQUEST_REPORT_STATUS.CANCELLED]: 'outline',
  [REQUEST_REPORT_STATUS.NEED_CLARIFICATION]: 'outline',
}

function reportStatusLabel(s: RequestReportStatusValue): string {
  const labels: Record<RequestReportStatusValue, string> = {
    [REQUEST_REPORT_STATUS.UNDER_REVIEW]: 'Under review',
    [REQUEST_REPORT_STATUS.PROCESSING]: 'Processing',
    [REQUEST_REPORT_STATUS.COMPLETED]: 'Completed',
    [REQUEST_REPORT_STATUS.CANCELLED]: 'Cancelled',
    [REQUEST_REPORT_STATUS.NEED_CLARIFICATION]: 'Need clarification',
  }
  return labels[s] ?? s
}

export function RequestReportRow({ report, status }: RequestReportRowProps) {
  const { mutate: downloadReportUpload, isPending: isDownloading } =
    useRequestReportUploadDownload()
  const hasReportFile = !!report.upload
  const estimatedPrice =
    report.estimatedPrice ?? report.price ?? 0
  const finalPrice = report.finalPrice ?? null
  const displayPrice = finalPrice ?? estimatedPrice
  const reportStatus = report.reportStatus ?? REQUEST_REPORT_STATUS.UNDER_REVIEW

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/20 hover:bg-muted/20">
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold leading-tight">{report.name}</p>
          <Badge
            variant={reportStatusVariant[reportStatus]}
            className={cn(
              reportStatus === REQUEST_REPORT_STATUS.COMPLETED &&
                'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400',
            )}
          >
            {reportStatusLabel(reportStatus)}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          {finalPrice != null ? (
            <>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                ${finalPrice.toLocaleString()}
                <span className="ml-1.5 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                  Final
                </span>
              </span>
              {estimatedPrice > 0 && (
                <span className="text-xs tabular-nums text-muted-foreground line-through">
                  Est. ${estimatedPrice.toLocaleString()}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm tabular-nums text-muted-foreground">
              ${displayPrice.toLocaleString()}
              <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/80">
                Estimated
              </span>
            </span>
          )}
        </div>
      </div>
      {hasReportFile ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 shrink-0 gap-1.5 text-primary border-primary/30 hover:text-primary hover:border-primary"
          disabled={isDownloading}
          onClick={() => downloadReportUpload(report.upload!.id)}
        >
          {isDownloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}{' '}
          Report
        </Button>
      ) : status === REQUEST_STATUS.COMPLETED ||
        reportStatus === REQUEST_REPORT_STATUS.COMPLETED ? (
        <Button
          size="sm"
          variant="outline"
          className="h-8 shrink-0 gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary"
          disabled
        >
          <Download className="h-3.5 w-3.5" /> Report
        </Button>
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground">
          <Activity className="h-4 w-4 animate-pulse" />
        </span>
      )}
    </div>
  )
}
