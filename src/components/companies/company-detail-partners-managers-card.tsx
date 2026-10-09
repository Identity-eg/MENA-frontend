import { Ban, Lock } from 'lucide-react'
import { memo } from 'react'

import type { TAuthSignatory, TManager, TPartner } from '@/types/company'
import { CompanyDetailAuthSignatoriesTable } from './company-detail-auth-signatories-table'
import { CompanyDetailManagersTable } from './company-detail-managers-table'
import { CompanyDetailPartnersTable } from './company-detail-partners-table'

type CompanyDetailPartnersManagersCardProps = {
  partnersRaw: TPartner[] | string | undefined
  managersRaw: TManager[] | string | undefined
  authSignatoriesRaw: TAuthSignatory[] | string | undefined
  partnersIsList: boolean
  managersIsList: boolean
  authSignatoriesIsList: boolean
  /** Masked and not offered for sale (company.unavailableFields). */
  partnersUnavailable: boolean
  managersUnavailable: boolean
  authSignatoriesUnavailable: boolean
}

function NotAvailableForPurchase({ subject }: { subject: string }) {
  return (
    <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
      <Ban className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
      <p className="text-sm font-medium text-foreground">
        Not available for purchase
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        {subject} for this company are not offered at the moment.
      </p>
    </div>
  )
}

export const CompanyDetailPartnersManagersCard = memo(
  function CompanyDetailPartnersManagersCard({
    partnersRaw,
    managersRaw,
    authSignatoriesRaw,
    partnersIsList,
    managersIsList,
    authSignatoriesIsList,
    partnersUnavailable,
    managersUnavailable,
    authSignatoriesUnavailable,
  }: CompanyDetailPartnersManagersCardProps) {
    return (
      <div className="space-y-6">
        <section className="mb-6 last:mb-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
            OWNERS/PARTNERS/SHAREHOLDERS
          </h3>
          {partnersIsList ? (
            <CompanyDetailPartnersTable rows={partnersRaw as TPartner[]} />
          ) : partnersUnavailable ? (
            <NotAvailableForPurchase subject="Partner details" />
          ) : typeof partnersRaw === 'string' ? (
            <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
              <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">
                Partner details are locked
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Unlock &ldquo;Partners, Managers & Auth. Sig.&rdquo; in Premium
                details above to view names, IDs, and ownership.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No partner data.</p>
          )}
        </section>

        <section className="mb-6 last:mb-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
            Managers/Directives
          </h3>
          {managersIsList ? (
            <CompanyDetailManagersTable rows={managersRaw as TManager[]} />
          ) : managersUnavailable ? (
            <NotAvailableForPurchase subject="Manager details" />
          ) : typeof managersRaw === 'string' ? (
            <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
              <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">
                Manager details are locked
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Unlock &ldquo;Partners, Managers & Auth. Sig.&rdquo; in Premium
                details above to view leadership and authority.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No manager data.</p>
          )}
        </section>

        <section className="mb-6 last:mb-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
            Authorized Signatories
          </h3>
          {authSignatoriesIsList ? (
            <CompanyDetailAuthSignatoriesTable
              rows={authSignatoriesRaw as TAuthSignatory[]}
            />
          ) : authSignatoriesUnavailable ? (
            <NotAvailableForPurchase subject="Authorized signatory details" />
          ) : typeof authSignatoriesRaw === 'string' ? (
            <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
              <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">
                Auth. Signatory details are locked
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Unlock &ldquo;Partners, Managers & Auth. Sig.&rdquo; in Premium
                details above to view authorized representatives.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No authorized signatory data.
            </p>
          )}
        </section>
      </div>
    )
  },
)
