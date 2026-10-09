import { VisualCard, VisualFrame } from './visual-frame'
import { Flag } from '@/components/marketing/flag'

const entries = [
  {
    issue: 'Issue 2026/211',
    code: 'eg',
    title: 'Amendment of articles, Nile Delta Logistics S.A.E.',
    date: '02 Sep 2026',
  },
  {
    issue: 'Issue 1497',
    code: 'kw',
    title: 'Liquidation notice, Salmiya Marine Supplies WLL',
    date: '28 Aug 2026',
  },
  {
    issue: 'B.O. 7412',
    code: 'ma',
    title: 'Manager change, Maghreb Agro Industries SARL',
    date: '19 Aug 2026',
  },
]

export function GazetteFeed() {
  return (
    <VisualFrame className="flex flex-col gap-2">
      {entries.map((entry) => (
        <VisualCard key={entry.issue} className="px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flag code={entry.code} className="h-2.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-navy/70">
                {entry.issue}
              </span>
            </div>
            <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
              {entry.date}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-snug">{entry.title}</p>
        </VisualCard>
      ))}

      <div className="mt-auto rounded-lg border border-dashed border-border px-3 py-2 text-center text-[11px] text-muted-foreground">
        Gazette coverage expands jurisdiction by jurisdiction
      </div>
    </VisualFrame>
  )
}
