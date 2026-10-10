import { cn } from '@/lib/utils'
import { REQUEST_STATUS } from '@/types/request'

/**
 * One meaning per hue: neutral = with us, amber = needs payment,
 * sky = paid and in progress, emerald = done, red = rejected, grey = cancelled.
 */
const tone = {
  neutral:
    'bg-muted text-muted-foreground [--dot:var(--color-muted-foreground)]',
  amber:
    'bg-amber-50 text-amber-800 [--dot:var(--color-amber-500)] dark:bg-amber-400/10 dark:text-amber-300',
  sky: 'bg-sky-50 text-sky-800 [--dot:var(--color-sky-500)] dark:bg-sky-400/10 dark:text-sky-300',
  emerald:
    'bg-emerald-50 text-emerald-800 [--dot:var(--color-emerald-500)] dark:bg-emerald-400/10 dark:text-emerald-300',
  red: 'bg-red-50 text-red-800 [--dot:var(--color-red-500)] dark:bg-red-400/10 dark:text-red-300',
  grey: 'bg-transparent text-muted-foreground ring-1 ring-inset ring-border [--dot:var(--color-muted-foreground)]',
} as const

const statusConfig: Record<string, { label: string; tone: keyof typeof tone }> =
  {
    [REQUEST_STATUS.UNDER_REVIEW]: { label: 'Under review', tone: 'neutral' },
    [REQUEST_STATUS.INVOICE_GENERATED]: {
      label: 'Invoice generated',
      tone: 'amber',
    },
    [REQUEST_STATUS.PAID]: { label: 'Paid', tone: 'sky' },
    [REQUEST_STATUS.PROCESSING]: { label: 'Processing', tone: 'sky' },
    [REQUEST_STATUS.COMPLETED]: { label: 'Completed', tone: 'emerald' },
    [REQUEST_STATUS.REJECTED]: { label: 'Rejected', tone: 'red' },
    [REQUEST_STATUS.CANCELLED]: { label: 'Cancelled', tone: 'grey' },
  }

interface StatusPillProps {
  status: string
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, ' '),
    tone: 'neutral' as const,
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        tone[config.tone],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-(--dot)" />
      {config.label}
    </span>
  )
}
