import { Check, X } from 'lucide-react'
import { memo } from 'react'

import type { TimelineStep } from '@/lib/request-timeline'
import { cn } from '@/lib/utils'

type RequestDetailTimelineNavProps = {
  timeline: Array<TimelineStep>
  submittedDate: string
  updatedDate: string
}

export const RequestDetailTimelineNav = memo(function RequestDetailTimelineNav({
  timeline,
  submittedDate,
  updatedDate,
}: RequestDetailTimelineNavProps) {
  return (
    <nav aria-label="Request progress">
      <ol className="flex flex-col sm:flex-row sm:items-start">
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1
          const note =
            idx === 0
              ? submittedDate
              : step.state === 'current' || step.state === 'stopped'
                ? `Since ${updatedDate}`
                : null
          return (
            <li
              key={step.status}
              aria-current={step.state === 'current' ? 'step' : undefined}
              className="relative flex flex-1 gap-3 pb-5 last:pb-0 sm:flex-col sm:gap-2 sm:pr-3 sm:pb-0"
            >
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-7 bottom-1 left-3 w-px sm:hidden',
                    step.state === 'done' ? 'bg-primary/60' : 'bg-border',
                  )}
                />
              )}
              <div className="flex items-center">
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums',
                    step.state === 'done' &&
                      'bg-primary text-primary-foreground',
                    step.state === 'current' &&
                      'bg-background text-primary ring-2 ring-primary',
                    step.state === 'upcoming' &&
                      'bg-muted text-muted-foreground',
                    step.state === 'stopped' &&
                      'bg-red-600 text-white dark:bg-red-500',
                  )}
                >
                  {step.state === 'done' ? (
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  ) : step.state === 'stopped' ? (
                    <X aria-hidden className="size-3.5" strokeWidth={3} />
                  ) : (
                    idx + 1
                  )}
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className={cn(
                      'ml-3 hidden h-px flex-1 sm:block',
                      step.state === 'done' ? 'bg-primary/60' : 'bg-border',
                    )}
                  />
                )}
              </div>
              <div className="space-y-0.5">
                <p
                  className={cn(
                    'text-sm leading-tight',
                    step.state === 'upcoming'
                      ? 'text-muted-foreground'
                      : 'font-medium text-foreground',
                    step.state === 'stopped' &&
                      'text-red-700 dark:text-red-300',
                  )}
                >
                  {step.label}
                  <span className="sr-only">
                    {step.state === 'done'
                      ? ' (done)'
                      : step.state === 'current'
                        ? ' (current step)'
                        : step.state === 'stopped'
                          ? ' (request closed)'
                          : ' (upcoming)'}
                  </span>
                </p>
                {note && (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {note}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
})
