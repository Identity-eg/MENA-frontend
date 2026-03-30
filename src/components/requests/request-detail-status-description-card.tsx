import { memo } from 'react'
import { Activity, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { RequestStatusValue } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'
import { requestDetailStatusConfig } from './request-detail-status-config'

type RequestDetailStatusDescriptionCardProps = {
  status: RequestStatusValue
}

export const RequestDetailStatusDescriptionCard = memo(
  function RequestDetailStatusDescriptionCard({
    status,
  }: RequestDetailStatusDescriptionCardProps) {
    const config = requestDetailStatusConfig[status]

    return (
      <Card>
        <CardContent className="flex items-start gap-4">
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              status === REQUEST_STATUS.COMPLETED
                ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400'
                : status === REQUEST_STATUS.CANCELLED ||
                    status === REQUEST_STATUS.REJECTED
                  ? 'bg-red-500/15 text-red-600 dark:bg-red-400/20 dark:text-red-400'
                  : 'bg-primary/10 text-primary',
            )}
          >
            {status === REQUEST_STATUS.COMPLETED ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : status === REQUEST_STATUS.CANCELLED ||
              status === REQUEST_STATUS.REJECTED ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <Activity className="h-5 w-5 animate-pulse" />
            )}
          </span>
          <div className="min-w-0 space-y-1">
            <h3 className="text-sm font-semibold">{config.label}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {config.description}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  },
)
