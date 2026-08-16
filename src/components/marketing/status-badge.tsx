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
        'inline-flex h-5 w-fit shrink-0 items-center rounded-full px-2.5 text-[10px] font-bold uppercase tracking-wide',
        status === 'Active'
          ? 'bg-brand-cyan text-brand-navy-deep'
          : 'bg-white/15 text-white/80',
        className,
      )}
    >
      {status}
    </span>
  )
}
