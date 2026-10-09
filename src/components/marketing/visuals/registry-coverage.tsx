import { Flag } from '@/components/marketing/flag'
import { jurisdictions } from '@/lib/jurisdictions'
import { cn } from '@/lib/utils'

/**
 * Coverage by jurisdiction, with the record types available at each registry.
 * Full depth tables sit behind registration, so this shows shape, not catalogue.
 */

const records = ['Extract', 'Ownership', 'Filings', 'Gazette'] as const

const depth: Record<string, number> = {
  eg: 4,
  sa: 4,
  kw: 4,
  qa: 3,
  ae: 4,
  om: 3,
  sy: 2,
  ma: 3,
  dz: 2,
  tn: 3,
  ir: 2,
  tr: 4,
}

export function RegistryCoverage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-brand-mist',
        className,
      )}
    >
      <div className="hidden grid-cols-[1fr_repeat(4,4.5rem)] gap-2 border-b border-border px-5 py-3 sm:grid">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Jurisdiction
        </span>
        {records.map((record) => (
          <span
            key={record}
            className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {record}
          </span>
        ))}
      </div>

      <ul className="divide-y divide-border/60">
        {jurisdictions.map((jurisdiction) => (
          <li
            key={jurisdiction.code}
            className="grid grid-cols-[1fr_repeat(4,2.25rem)] items-center gap-2 px-5 py-3 sm:grid-cols-[1fr_repeat(4,4.5rem)]"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <Flag code={jurisdiction.code} className="h-3 shrink-0" />
              {jurisdiction.name}
            </span>
            {records.map((record, index) => {
              const available = index < (depth[jurisdiction.code] ?? 0)
              return (
                <span
                  key={record}
                  title={`${record}: ${available ? 'available' : 'on request'}`}
                  className="flex justify-center"
                >
                  <span
                    className={cn(
                      'h-1.5 w-8 rounded-full',
                      available ? 'bg-brand-cyan-ink' : 'bg-border',
                    )}
                  />
                  <span className="sr-only">
                    {record}: {available ? 'available' : 'on request'}
                  </span>
                </span>
              )
            })}
          </li>
        ))}
      </ul>

      <p className="border-t border-border px-5 py-3.5 text-xs text-muted-foreground">
        Filled marks show what we retrieve as standard. Anything unfilled is
        available on request through our regional network.
      </p>
    </div>
  )
}
