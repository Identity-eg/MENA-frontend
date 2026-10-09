import { ChevronDown, ChevronUp } from 'lucide-react'

import { VisualCard, VisualFrame } from './visual-frame'
import { Flag } from '@/components/marketing/flag'

const people = [
  { name: 'Abdulaziz Al-Rashed', code: 'sa', role: 'Chairman' },
  {
    name: 'Fatma El Sayed',
    code: 'eg',
    role: 'Company secretary',
    expanded: true,
    detail: [
      { label: 'Nationality', value: 'Egypt' },
      { label: 'Appointed', value: 'Mar 2019' },
      { label: 'Companies', value: '3' },
      { label: 'Role', value: 'Company secretary' },
    ],
  },
  { name: 'Hicham Benjelloun', code: 'ma', role: 'Director' },
  { name: 'Yusuf Demirel', code: 'tr', role: 'Director' },
]

export function DirectorsList() {
  return (
    <VisualFrame className="flex flex-col gap-2">
      {people.map((person) => (
        <VisualCard key={person.name}>
          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <Flag code={person.code} className="h-3 shrink-0" />
              <span className="truncate text-[13px] font-medium">
                {person.name}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
              <span className="text-[11px]">{person.role}</span>
              {person.expanded ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </div>
          </div>

          {person.detail && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-3 py-2.5">
              {person.detail.map((row) => (
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
      ))}
    </VisualFrame>
  )
}
