import { jurisdictions } from '@/lib/jurisdictions'
import { cn } from '@/lib/utils'

/**
 * Visual-only coverage strip — country names only, no per-country headings
 * or service copy, so it can't function as a substitute for the gated
 * jurisdiction/service catalogue (PRD §6.3).
 */
export function JurisdictionBadgeRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-2', className)}>
      {jurisdictions.map((j) => (
        <span
          key={j.code}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-brand-navy"
        >
          <span aria-hidden>{j.flag}</span>
          {j.name}
        </span>
      ))}
    </div>
  )
}
