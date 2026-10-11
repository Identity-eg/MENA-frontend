import { Ban, Lock } from 'lucide-react'
import { memo } from 'react'

import { CompanyDetailAuthSignatoriesTable } from './company-detail-auth-signatories-table'
import { CompanyDetailManagersTable } from './company-detail-managers-table'
import { CompanyDetailPartnersTable } from './company-detail-partners-table'
import type {
  TAuthSignatory,
  TManager,
  TPartner,
  TSensitiveField,
} from '@/types/company'
import type { ReactNode } from 'react'
import { displayState } from '@/lib/sensitive-fields'
import { formatCredits } from '@/lib/credits'

type CompanyDetailPartnersManagersCardProps = {
  partners: TSensitiveField | undefined
  managers: TSensitiveField | undefined
  authSignatories: TSensitiveField | undefined
}

function Notice({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
      <div className="mx-auto mb-2 flex justify-center text-muted-foreground/60">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
        {children}
      </p>
    </div>
  )
}

function PeopleSection({
  title,
  field,
  renderTable,
}: {
  title: string
  field: TSensitiveField | undefined
  renderTable: (rows: Array<unknown>) => ReactNode
}) {
  if (!field) return null
  const state = displayState(field)
  const rows = Array.isArray(field.value) ? field.value : []

  return (
    <section className="mb-6 last:mb-0">
      <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {state === 'unlocked' ? (
        rows.length > 0 ? (
          renderTable(rows)
        ) : (
          <p className="text-sm text-muted-foreground">None on record.</p>
        )
      ) : state === 'locked' ? (
        <Notice
          icon={<Lock className="h-6 w-6" aria-hidden />}
          title={`${field.label}: locked`}
        >
          Unlock &ldquo;{field.label}&rdquo; in Premium details above for{' '}
          {formatCredits(field.cost)}.
        </Notice>
      ) : (
        <Notice
          icon={<Ban className="h-6 w-6" aria-hidden />}
          title={`${field.label}: not available`}
        >
          {field.label} for this company can&rsquo;t be unlocked right now.
        </Notice>
      )}
    </section>
  )
}

/** Partners, managers and signatories: each a Sensitive field, shown as its state allows. */
export const CompanyDetailPartnersManagersCard = memo(
  function CompanyDetailPartnersManagersCard({
    partners,
    managers,
    authSignatories,
  }: CompanyDetailPartnersManagersCardProps) {
    if (!partners && !managers && !authSignatories) return null
    return (
      <div className="space-y-6">
        <PeopleSection
          title="Owners/Partners/Shareholders"
          field={partners}
          renderTable={(rows) => (
            <CompanyDetailPartnersTable rows={rows as Array<TPartner>} />
          )}
        />
        <PeopleSection
          title="Managers/Directives"
          field={managers}
          renderTable={(rows) => (
            <CompanyDetailManagersTable rows={rows as Array<TManager>} />
          )}
        />
        <PeopleSection
          title="Authorized Signatories"
          field={authSignatories}
          renderTable={(rows) => (
            <CompanyDetailAuthSignatoriesTable
              rows={rows as Array<TAuthSignatory>}
            />
          )}
        />
      </div>
    )
  },
)
