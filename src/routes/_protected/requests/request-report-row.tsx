import { Activity, Download, Loader2 } from 'lucide-react'
import type { RequestStatusValue } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'
import { Button } from '@/components/ui/button'
import { useRequestReportUploadDownload } from '@/apis/requests/get-request-report-upload-download-url'

export type RequestReportRowReport = {
  id: number
  name: string
  price?: number
  upload?: { id: number } | null
}

type RequestReportRowProps = {
  report: RequestReportRowReport
  status: RequestStatusValue
}

export function RequestReportRow({ report, status }: RequestReportRowProps) {
  const { mutate: downloadReportUpload, isPending: isDownloading } =
    useRequestReportUploadDownload()
  const hasReportFile = !!report.upload

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/20 hover:bg-muted/20">
      <div className="min-w-0 space-y-1.5">
        <p className="text-sm font-semibold leading-tight">{report.name}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs tabular-nums text-muted-foreground">
            ${report?.price?.toLocaleString()}
          </span>
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
      ) : status === REQUEST_STATUS.COMPLETED ? (
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
