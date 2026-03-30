import { memo } from 'react'
import { Lock, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { TCompanyManager, TCompanyPartner } from '@/types/company'
import { CompanyDetailManagersTable } from './company-detail-managers-table'
import { CompanyDetailPartnersTable } from './company-detail-partners-table'

type CompanyDetailPartnersManagersCardProps = {
  partnersRaw: TCompanyPartner[] | string | undefined
  managersRaw: TCompanyManager[] | string | undefined
  partnersIsList: boolean
  managersIsList: boolean
}

export const CompanyDetailPartnersManagersCard = memo(
  function CompanyDetailPartnersManagersCard({
    partnersRaw,
    managersRaw,
    partnersIsList,
    managersIsList,
  }: CompanyDetailPartnersManagersCardProps) {
    return (
      <Card className="overflow-hidden rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Partners & managers
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Shareholding and leadership (may require unlock)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Partners & shareholders
            </h3>
            {partnersIsList ? (
              <CompanyDetailPartnersTable rows={partnersRaw as TCompanyPartner[]} />
            ) : typeof partnersRaw === 'string' ? (
              <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Partner details are locked
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Unlock &ldquo;Partners & shareholders&rdquo; in Premium details
                  above to view names, IDs, and ownership.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No partner data.</p>
            )}
          </section>
          <Separator />
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Managers
            </h3>
            {managersIsList ? (
              <CompanyDetailManagersTable rows={managersRaw as TCompanyManager[]} />
            ) : typeof managersRaw === 'string' ? (
              <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Manager details are locked
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Unlock &ldquo;Managers&rdquo; in Premium details above to view
                  leadership and authority.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No manager data.</p>
            )}
          </section>
        </CardContent>
      </Card>
    )
  },
)
