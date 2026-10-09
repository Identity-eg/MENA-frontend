import { VisualFrame } from './visual-frame'
import { Flag } from '@/components/marketing/flag'

/**
 * Shareholder structure for a sample Gulf holding: two upstream holders, one
 * of them offshore, resolving into the target entity.
 */

const holders = [
  { name: 'Al Manara Holding', code: 'ae', share: '62.5%', x: '20%' },
  { name: 'Crescent Partners', code: 'kw', share: '37.5%', x: '78%' },
]

export function OwnershipGraph() {
  return (
    <VisualFrame dotted>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M20 26 C 20 58, 50 52, 50 74"
          fill="none"
          stroke="var(--brand-cyan-ink)"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M78 26 C 78 58, 50 52, 50 74"
          fill="none"
          stroke="rgba(11,36,114,0.28)"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {holders.map((holder) => (
        <div
          key={holder.name}
          className="absolute top-[14%] -translate-x-1/2 -translate-y-1/2"
          style={{ left: holder.x }}
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 shadow-md">
            <Flag code={holder.code} className="h-3" />
            <span className="whitespace-nowrap text-xs font-medium text-brand-navy">
              {holder.name}
            </span>
          </div>
        </div>
      ))}

      <span className="absolute left-[27%] top-[46%] rounded-md bg-brand-cyan-ink px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
        62.5%
      </span>
      <span className="absolute right-[27%] top-[46%] rounded-md border border-border bg-white px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
        37.5%
      </span>

      <div className="absolute left-1/2 top-[76%] w-[74%] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-xl border border-brand-cyan-ink/35 bg-brand-cyan/10 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Flag code="ae" className="h-3" />
            <span className="text-[13px] font-semibold text-brand-navy">
              Al Manara Marine Services LLC
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Abu Dhabi, licence CN-1108442
          </p>
        </div>
      </div>
    </VisualFrame>
  )
}
