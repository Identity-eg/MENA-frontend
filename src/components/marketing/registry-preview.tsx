import { useState } from 'react'
import { Building2, FileText, Lock, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Flag } from '@/components/marketing/flag'
import { cn } from '@/lib/utils'

/**
 * A working, cut-down rendering of the company record the portal serves, using
 * the same field labels as `company-detail-profile-card`. It is the marketing
 * site's product shot: real markup, real interaction, no screenshot to go stale.
 *
 * The record shown is a composite sample, not a customer's data.
 */

type TabKey = 'profile' | 'ownership' | 'filings'

const profileFields = [
  { label: 'Registration no.', value: '1194-07321' },
  { label: 'Legal form', value: 'Joint Stock Company (S.A.E.)' },
  { label: 'Established', value: '14 Mar 2016' },
  { label: 'Issued capital', value: 'EGP 42,650,000' },
  { label: 'Activity', value: 'Freight forwarding and customs brokerage' },
  { label: 'Tax reg. no.', value: '486-219-704' },
]

const owners = [
  { name: 'Hoda Mansour', role: 'Chair', share: '38.4%' },
  { name: 'Karim El-Sharkawy', role: 'Managing director', share: '27.1%' },
  { name: 'Delta Holding B.V.', role: 'Corporate partner', share: '19.5%' },
  { name: 'Yasmine Abdel-Rahim', role: 'Partner', share: '15.0%' },
]

const filings = [
  { date: '02 Sep 2026', type: 'Capital increase', ref: 'AMD-2026-4417' },
  { date: '11 Jun 2026', type: 'Manager appointment', ref: 'AMD-2026-2980' },
  { date: '23 Jan 2026', type: 'Registered address', ref: 'AMD-2026-0614' },
]

const tabs: Array<{ key: TabKey; label: string; icon: typeof Building2 }> = [
  { key: 'profile', label: 'Profile', icon: Building2 },
  { key: 'ownership', label: 'Ownership', icon: Users },
  { key: 'filings', label: 'Filings', icon: FileText },
]

export function RegistryPreview({ className }: { className?: string }) {
  const [active, setActive] = useState<TabKey>('profile')

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-white text-brand-ink shadow-[0_20px_56px_-28px_rgba(11,36,114,0.35)]',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Flag code="eg" />
            <span className="truncate text-[15px] font-semibold tracking-title">
              Nile Delta Logistics S.A.E.
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Egypt, General Authority for Investment
          </p>
        </div>
        <Badge className="border-brand-cyan-ink/25 bg-brand-cyan/15 text-[11px] font-semibold text-brand-cyan-ink">
          Verified at source
        </Badge>
      </div>

      <div
        role="tablist"
        aria-label="Company record sections"
        className="flex gap-1 border-b border-border px-3 pt-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const selected = active === tab.key
          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(tab.key)}
              className={cn(
                'relative -mb-px inline-flex cursor-pointer items-center gap-1.5 rounded-t-md px-3 py-2 text-[13px] font-medium transition-colors',
                selected
                  ? 'text-brand-navy'
                  : 'text-muted-foreground hover:text-brand-navy',
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-opacity',
                  selected ? 'bg-brand-cyan-ink opacity-100' : 'opacity-0',
                )}
              />
            </button>
          )
        })}
      </div>

      <div className="px-5 py-4">
        {active === 'profile' && (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.label}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="mt-0.5 text-[13px] font-medium">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {active === 'ownership' && (
          <ul className="divide-y divide-border">
            {owners.map((owner) => (
              <li
                key={owner.name}
                className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">
                    {owner.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{owner.role}</p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold tabular-nums text-brand-navy">
                  {owner.share}
                </span>
              </li>
            ))}
          </ul>
        )}

        {active === 'filings' && (
          <ul className="divide-y divide-border">
            {filings.map((filing) => (
              <li
                key={filing.ref}
                className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">
                    {filing.type}
                  </p>
                  <p className="text-xs text-muted-foreground">{filing.ref}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {filing.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-brand-mist/70 px-5 py-3 text-xs text-muted-foreground">
        <Lock className="size-3.5 shrink-0 text-brand-navy/60" />
        Civil IDs, addresses, and full amendment history unlock on request.
      </div>
    </div>
  )
}
