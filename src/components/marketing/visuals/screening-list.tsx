import { AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react'

import { VisualCard, VisualFrame } from './visual-frame'
import { Flag } from '@/components/marketing/flag'

const hits = [
  {
    source: 'OFAC SDN List',
    code: 'us',
    verdict: 'Sanctioned',
    expanded: true,
    detail: [
      { label: 'Since', value: 'Jan 2024' },
      { label: 'Authority', value: 'U.S. Treasury' },
      { label: 'Programme', value: 'SYRIA-EO13894' },
      { label: 'Match', value: 'Name and DOB' },
    ],
  },
  { source: 'EU consolidated list', code: 'eu', verdict: 'No match' },
  { source: 'Regional press, Arabic', code: 'eg', verdict: '2 mentions' },
]

export function ScreeningList() {
  return (
    <VisualFrame className="flex flex-col gap-2">
      {hits.map((hit) => {
        const flagged = hit.verdict === 'Sanctioned'
        return (
          <VisualCard key={hit.source}>
            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <Flag code={hit.code} className="h-3 shrink-0" />
                <span className="truncate text-[13px] font-medium">
                  {hit.source}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span
                  className={
                    flagged
                      ? 'inline-flex items-center gap-1 text-[11px] font-semibold text-red-600'
                      : 'text-[11px] text-muted-foreground'
                  }
                >
                  {flagged && <AlertOctagon className="size-3" />}
                  {hit.verdict}
                </span>
                {hit.expanded ? (
                  <ChevronUp className="size-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                )}
              </div>
            </div>

            {hit.detail && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-3 py-2.5">
                {hit.detail.map((row) => (
                  <div key={row.label}>
                    <dt className="text-[10px] text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-[12px] font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </VisualCard>
        )
      })}
    </VisualFrame>
  )
}
