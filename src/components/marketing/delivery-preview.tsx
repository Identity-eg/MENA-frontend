import { ArrowDownToLine, Check, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Compact rendering of the request lifecycle the portal tracks, using the same
 * stage labels as `request-detail-status-config`. Shown on the marketing site so
 * a buyer can see what "1-3 business days" actually looks like end to end.
 */

const stages = [
  { label: 'Under review', stamp: 'Mon 09:12', state: 'done' },
  { label: 'Invoice generated', stamp: 'Mon 11:40', state: 'done' },
  { label: 'Paid', stamp: 'Mon 14:03', state: 'done' },
  { label: 'Processing', stamp: 'In progress', state: 'current' },
  { label: 'Completed', stamp: 'Est. Wed', state: 'todo' },
] as const

export function DeliveryPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-white text-brand-ink shadow-[0_20px_56px_-28px_rgba(11,36,114,0.35)]',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <p className="text-[15px] font-semibold tracking-title">
            Corporate extract, 3 subjects
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Request RQ-4812, Kuwait and UAE
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          Day 2 of 3
        </span>
      </div>

      <ol className="px-5 py-4">
        {stages.map((stage, index) => {
          const last = index === stages.length - 1
          return (
            <li key={stage.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded-full border',
                    stage.state === 'done' &&
                      'border-brand-navy bg-brand-navy text-brand-navy',
                    stage.state === 'current' &&
                      'border-brand-cyan-ink bg-brand-cyan/15 text-brand-cyan-ink',
                    stage.state === 'todo' && 'border-border bg-white',
                  )}
                >
                  {stage.state === 'done' && <Check className="size-3" />}
                  {stage.state === 'current' && (
                    <Loader2 className="size-3 motion-safe:animate-spin" />
                  )}
                </span>
                {!last && (
                  <span
                    aria-hidden
                    className={cn(
                      'my-1 w-px flex-1',
                      stage.state === 'done' ? 'bg-brand-navy/30' : 'bg-border',
                    )}
                  />
                )}
              </div>
              <div
                className={cn(
                  'flex flex-1 items-baseline justify-between gap-4',
                  !last && 'pb-4',
                )}
              >
                <span
                  className={cn(
                    'text-[13px]',
                    stage.state === 'todo'
                      ? 'text-muted-foreground'
                      : 'font-medium',
                  )}
                >
                  {stage.label}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {stage.stamp}
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex items-center gap-2 border-t border-border bg-brand-mist/70 px-5 py-3 text-xs text-muted-foreground">
        <ArrowDownToLine className="size-3.5 shrink-0 text-brand-navy/60" />
        Reports and invoices download from the same request. No email chains.
      </div>
    </div>
  )
}
