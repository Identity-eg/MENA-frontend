import { cn } from '@/lib/utils'

export function StatTile({
  value,
  label,
  className,
}: {
  value: string
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-brand-cyan/30 bg-white/[0.03] px-5 py-5 text-center sm:px-6 sm:py-6',
        className,
      )}
    >
      <div className="font-black text-3xl text-brand-cyan tabular-nums tracking-tight sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 sm:text-xs">
        {label}
      </div>
    </div>
  )
}

export function StatTileRow({
  stats,
  className,
}: {
  stats: Array<{ value: string; label: string }>
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4',
        className,
      )}
    >
      {stats.map((stat) => (
        <StatTile key={stat.label} value={stat.value} label={stat.label} />
      ))}
    </div>
  )
}
