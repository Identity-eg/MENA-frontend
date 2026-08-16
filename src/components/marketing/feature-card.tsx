import { cn } from '@/lib/utils'

export function FeatureCard({
  title,
  description,
  accent = 'cyan',
  className,
}: {
  title: string
  description: string
  accent?: 'cyan' | 'lime' | 'muted'
  className?: string
}) {
  const accentVar =
    accent === 'cyan'
      ? 'var(--brand-cyan)'
      : accent === 'lime'
        ? 'var(--brand-lime)'
        : 'var(--border)'

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-brand-mist/60 border-t-[3px] p-5 sm:p-6',
        className,
      )}
      style={{ borderTopColor: accentVar }}
    >
      <h3 className="text-sm font-bold uppercase tracking-wide text-brand-navy sm:text-[13px]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
