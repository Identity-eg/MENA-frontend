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
import { useCompanyDetailDerived } from './use-company-detail-derived'
import { useGetCompany } from '@/apis/company/get-company'

const routeApi = getRouteApi('/_protected/companies/$companyId')

export function CompanyDetailView() {
  const { companyId } = routeApi.useParams()
  const id = Number(companyId)

  const { data: companyData } = useGetCompany(id)
  const company = companyData.data

  const [selectedReports, setSelectedReports] = useState<Array<number>>([])

  const {
    publicFields,
    sensitiveFields,
    unlockAllCost,
    partners,
    managers,
    authSignatories,
  } = useCompanyDetailDerived(company)

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
    </div>
  )
}
