import { Bell } from 'lucide-react'

import { VisualCard, VisualFrame } from './visual-frame'
import { Flag } from '@/components/marketing/flag'

const events = [
  {
    title: 'Manager appointed',
    company: 'Gulf Petrochem Trading WLL',
    code: 'qa',
    stamp: 'Just now',
  },
  {
    title: 'Capital increased',
    company: 'Nile Delta Logistics S.A.E.',
    code: 'eg',
    stamp: '2h ago',
  },
  {
    title: 'Licence status changed',
    company: 'Maghreb Agro Industries SARL',
    code: 'ma',
    stamp: 'Yesterday',
  },
  {
    title: 'New gazette entry',
    company: 'Anatolia Steel A.S.',
    code: 'tr',
    stamp: '2 days ago',
  },
]

export function MonitoringFeed() {
  return (
    <VisualFrame className="flex flex-col gap-2">
      {events.map((event) => (
        <VisualCard key={event.company} className="px-3 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <Bell className="mt-0.5 size-3.5 shrink-0 text-brand-navy/50" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">
                  {event.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Flag code={event.code} className="h-2.5 shrink-0" />
                  <span className="truncate">{event.company}</span>
                </p>
              </div>
            </div>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {event.stamp}
            </span>
          </div>
        </VisualCard>
      ))}
    </VisualFrame>
  )
}
