import { cn } from '@/lib/utils'

export function StatusBadge({
  status,
  className,
}: {
  status: 'Active' | 'Soon'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 w-fit shrink-0 items-center rounded-full border px-2.5 text-[10px] font-semibold uppercase tracking-wide',
        status === 'Active'
          ? 'border-brand-cyan-ink/25 bg-brand-cyan/15 text-brand-cyan-ink'
          : 'border-border bg-brand-mist text-muted-foreground',
        className,
      )}
    >
      {status}
    </span>
  )
}
