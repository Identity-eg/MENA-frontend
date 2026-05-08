import { memo } from 'react'
import { Lock } from 'lucide-react'
import type { TPartner, TManager, TAuthSignatory } from '@/types/company'
import { CompanyDetailManagersTable } from './company-detail-managers-table'
import { CompanyDetailPartnersTable } from './company-detail-partners-table'
import { CompanyDetailAuthSignatoriesTable } from './company-detail-auth-signatories-table'

type CompanyDetailPartnersManagersCardProps = {
  partnersRaw: TPartner[] | string | undefined
  managersRaw: TManager[] | string | undefined
  authSignatoriesRaw: TAuthSignatory[] | string | undefined
  partnersIsList: boolean
  managersIsList: boolean
  authSignatoriesIsList: boolean
}

export const CompanyDetailPartnersManagersCard = memo(
  function CompanyDetailPartnersManagersCard({
    partnersRaw,
    managersRaw,
    authSignatoriesRaw,
    partnersIsList,
    managersIsList,
    authSignatoriesIsList,
  }: CompanyDetailPartnersManagersCardProps) {
    return (
      <div className="space-y-6">
        <section className="mb-6 last:mb-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
            OWNERS/PARTNERS/SHAREHOLDERS
          </h3>
            {partnersIsList ? (
              <CompanyDetailPartnersTable rows={partnersRaw as TPartner[]} />
            ) : typeof partnersRaw === 'string' ? (
              <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Partner details are locked
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Unlock &ldquo;Partners, Managers & Auth. Sig.&rdquo; in Premium details
                  above to view names, IDs, and ownership.
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
            ) : typeof managersRaw === 'string' ? (
              <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Manager details are locked
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Unlock &ldquo;Partners, Managers & Auth. Sig.&rdquo; in Premium details
                  above to view leadership and authority.
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
              <CompanyDetailAuthSignatoriesTable rows={authSignatoriesRaw as TAuthSignatory[]} />
            ) : typeof authSignatoriesRaw === 'string' ? (
              <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Auth. Signatory details are locked
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Unlock &ldquo;Partners, Managers & Auth. Sig.&rdquo; in Premium details
                  above to view authorized representatives.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No authorized signatory data.</p>
            )}
        </section>
      </div>
    )
  },
)
