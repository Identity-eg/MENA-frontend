import { cn } from '@/lib/utils'
import { StatusPill } from './StatusPill'
import type { RequestStatus } from '@/types'

interface PageHeaderProps {
  title: string
  subtitle?: string
  requestId?: string
  status?: RequestStatus
  createdAt?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  requestId,
  status,
  createdAt,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {(subtitle || requestId || status || createdAt) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {requestId && (
              <span>
                Request ID{' '}
                <span className="font-medium text-foreground">{requestId}</span>
              </span>
            )}
            {status && (
              <span className="flex items-center gap-1.5">
                Status <StatusPill status={status} />
              </span>
            )}
            {createdAt && (
              <span>
                Created {new Date(createdAt).toLocaleDateString('en-US')}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
