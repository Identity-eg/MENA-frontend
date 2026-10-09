import { cn } from '@/lib/utils'

/**
 * The panel every product visual sits on. One surface treatment, one height, so
 * a row of visuals lines up without each one inventing its own padding.
 *
 * Visuals are decorative restatements of UI shown elsewhere on the page, so the
 * frame is hidden from assistive tech; the heading and body beside it carry the
 * meaning.
 */
export function VisualFrame({
  children,
  className,
  dotted = false,
}: {
  children: React.ReactNode
  className?: string
  /** Graph-style visuals get a dot grid behind them. */
  dotted?: boolean
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative isolate h-[19rem] overflow-hidden rounded-2xl border border-border bg-brand-mist p-5',
        className,
      )}
    >
      {dotted && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(11,36,114,0.16)_1px,transparent_1px)] [background-size:13px_13px]" />
      )}
      {children}
    </div>
  )
}

/** White card used inside a frame, matching the portal's own surfaces. */
export function VisualCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-white text-brand-ink shadow-[0_6px_18px_-10px_rgba(11,36,114,0.22)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
