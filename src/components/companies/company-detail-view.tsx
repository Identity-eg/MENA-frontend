import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'

import { CompanyDetailBreadcrumb } from './company-detail-breadcrumb'
import { CompanyDetailComplianceCard } from './company-detail-compliance-card'
import { CompanyDetailHero } from './company-detail-hero'
import { CompanyDetailPartnersManagersCard } from './company-detail-partners-managers-card'
import { CompanyDetailPremiumLockedCard } from './company-detail-premium-locked-card'
import { CompanyDetailProfileCard } from './company-detail-profile-card'
import { CompanyDetailSidebar } from './company-detail-sidebar'
import { CompanyDetailUnlockedFieldsCard } from './company-detail-unlocked-fields-card'
import { UnlockDialog } from './unlock-dialog'
import { useCompanyDetailDerived } from './use-company-detail-derived'
import type { UnlockTarget } from './unlock-dialog'
import type { TSensitiveField } from '@/types/company'
import { offersUnlockAll } from '@/lib/sensitive-fields'
import { useGetCompany } from '@/apis/company/get-company'

const routeApi = getRouteApi('/_protected/companies/$companyId')

export function CompanyDetailView() {
  const { companyId } = routeApi.useParams()
  const id = Number(companyId)

  const { data: companyData } = useGetCompany(id)
  const company = companyData.data

  const [selectedReports, setSelectedReports] = useState<Array<number>>([])
  const [unlockTarget, setUnlockTarget] = useState<
    { kind: 'field'; field: TSensitiveField } | { kind: 'all' } | null
  >(null)

  const {
    publicFields,
    sensitiveFields,
    unlockAllCost,
    partners,
    managers,
    authSignatories,
  } = useCompanyDetailDerived(company)

  // "Unlock all" reads the remaining fields and total live, so a refetch after a refusal shows them.
  const dialogTarget: UnlockTarget | null =
    unlockTarget?.kind === 'all'
      ? { kind: 'all', fields: sensitiveFields.locked, total: unlockAllCost }
      : unlockTarget

  const toggleReport = (reportId: number) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((x) => x !== reportId)
        : [...prev, reportId],
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <CompanyDetailBreadcrumb companyNameEn={company.companyNameEn ?? '—'} />

      <CompanyDetailHero
        companyNameEn={company.companyNameEn}
        companyNameAr={company.companyNameAr}
        activityName={company.activityName}
        country={company.country}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          <CompanyDetailPremiumLockedCard
            lockedFields={sensitiveFields.locked}
            unavailableFields={sensitiveFields.unavailable}
            unlockAllCost={unlockAllCost}
            offerUnlockAll={offersUnlockAll(company.sensitiveFields)}
            onUnlockField={(field) => setUnlockTarget({ kind: 'field', field })}
            onUnlockAll={() => setUnlockTarget({ kind: 'all' })}
          />

          <CompanyDetailUnlockedFieldsCard fields={sensitiveFields.unlocked} />

          <CompanyDetailProfileCard publicFields={publicFields}>
            {(partners || managers || authSignatories) && (
              <CompanyDetailPartnersManagersCard
                partners={partners}
                managers={managers}
                authSignatories={authSignatories}
              />
            )}
          </CompanyDetailProfileCard>

          <CompanyDetailComplianceCard
            companyId={id}
            reports={company.reports}
            selectedReports={selectedReports}
            onToggleReport={toggleReport}
          />
        </div>

        <CompanyDetailSidebar
          country={company.country}
          activityName={company.activityName}
          legalForm={company.legalForm}
          lockedFieldCount={sensitiveFields.locked.length}
        />
      </div>

      {/* Lives outside the locked card so it stays mounted when the field it unlocks moves to "Unlocked details". */}
      <UnlockDialog
        companyId={id}
        target={dialogTarget}
        onClose={() => setUnlockTarget(null)}
      />
    </div>
  )
}
