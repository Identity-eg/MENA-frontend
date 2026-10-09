import { VisualCard, VisualFrame } from './visual-frame'
import { Flag } from '@/components/marketing/flag'

const rows = [
  { code: 'eg', name: 'Egypt', count: '1,284,610' },
  { code: 'sa', name: 'Saudi Arabia', count: '1,107,392' },
  { code: 'ae', name: 'UAE', count: '842,155' },
  { code: 'tr', name: 'Türkiye', count: '763,048' },
  { code: 'ma', name: 'Morocco', count: '418,927' },
]

export function DatabaseScale() {
  return (
    <VisualFrame className="flex flex-col">
      <VisualCard className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-baseline justify-between gap-3 border-b border-border px-3.5 py-2.5">
          <span className="text-[12px] font-semibold">IdentBase</span>
          <span className="text-[11px] text-muted-foreground">
            Refreshed monthly
          </span>
        </div>

        <ul className="flex-1 divide-y divide-border px-3.5">
          {rows.map((row) => (
            <li
              key={row.code}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <Flag code={row.code} className="h-3 shrink-0" />
                <span className="truncate text-[13px]">{row.name}</span>
              </span>
              <span className="shrink-0 text-[12px] font-medium tabular-nums text-brand-navy">
                {row.count}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-border bg-brand-mist/70 px-3.5 py-2.5 text-[11px] text-muted-foreground">
          Seven further jurisdictions on file
        </div>
      </VisualCard>
    </VisualFrame>
  )
}
