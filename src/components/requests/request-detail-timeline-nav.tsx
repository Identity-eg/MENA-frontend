import { memo } from 'react'
import type { RequestStatusValue } from '@/types/request'
import { cn } from '@/lib/utils'
import type { RequestDetailTimelineStep } from './use-request-detail-timeline'

type RequestDetailTimelineNavProps = {
  timeline: RequestDetailTimelineStep[]
  status: RequestStatusValue
}

export const RequestDetailTimelineNav = memo(function RequestDetailTimelineNav({
  timeline,
  status,
}: RequestDetailTimelineNavProps) {
  return (
    <nav
      aria-label="Request status"
      className="rounded-xl border bg-card px-3 py-4 overflow-x-auto"
    >
      <div
        className="flex items-start"
        style={{ minWidth: `${timeline.length * 90}px` }}
      >
        {timeline.map((step, idx) => (
          <div
            key={step.status}
            className="relative flex flex-1 flex-col items-center gap-2 text-center"
          >
            {idx < timeline.length - 1 && (
              <div
                className={cn(
                  'absolute top-4 left-1/2 h-0.5',
                  step.active ? 'bg-primary/50' : 'bg-muted',
                )}
                style={{ width: '100%', left: '50%' }}
              />
            )}

            <div
              role="listitem"
              aria-current={status === step.status ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div className="relative flex flex-col items-center">
                {status === step.status && (
                  <span className="absolute inset-0 z-0 h-8 w-8 animate-ping rounded-full bg-primary/40" />
                )}
                <span
                  className={cn(
                    'relative z-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all',
                    step.active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted bg-card text-muted-foreground',
                    status === step.status &&
                      'ring-2 ring-primary ring-offset-2 ring-offset-background',
                  )}
                >
                  {idx + 1}
                </span>
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium leading-tight px-1 max-w-20',
                  step.active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                {step.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </nav>
  )
})
