import { cn } from '@/lib/utils'

/**
 * Vertical rhythm for the marketing site. Every section uses one of these so
 * the page keeps a single spacing scale instead of per-section padding values.
 */
export function Section({
  children,
  className,
  bleed = false,
  id,
}: {
  children: React.ReactNode
  className?: string
  /** Skip the inner max-width container (full-bleed photography, marquees). */
  bleed?: boolean
  id?: string
}) {
  return (
    <section id={id} className={cn('py-20 sm:py-28 lg:py-36', className)}>
      {bleed ? (
        children
      ) : (
        <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
      )}
    </section>
  )
}

/**
 * Section header. Body copy sits directly under the headline, never floated in
 * the opposite corner, and the optional aside is reserved for a real link.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  aside,
  align = 'start',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  body?: string
  aside?: React.ReactNode
  align?: 'start' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
        align === 'center' && 'lg:flex-col lg:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'text-center')}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-cyan-ink">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.02] tracking-heading text-brand-navy sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {body && (
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
            {body}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  )
}

/** Hairline used between stacked rows. One rule, never doubled up. */
export function Hairline({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('h-px w-full bg-white/10', className)} />
  )
}
