import { useCallback, useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  getCompanyQueryOptions,
  useGetCompany,
} from '@/apis/company/get-company'
import { createUnlockPaymentSession } from '@/apis/unlocks/create-unlock-payment-session'
import { createUnlockAllPaymentSession } from '@/apis/unlocks/create-unlock-all-payment-session'
import { getUnlocksQueryOptions } from '@/apis/unlocks/get-unlocks'
import { CompanyDetailBreadcrumb } from './company-detail-breadcrumb'
import { CompanyDetailComplianceCard } from './company-detail-compliance-card'
import { CompanyDetailHero } from './company-detail-hero'
import { CompanyDetailPartnersManagersCard } from './company-detail-partners-managers-card'
import { CompanyDetailPremiumLockedCard } from './company-detail-premium-locked-card'
import { CompanyDetailProfileCard } from './company-detail-profile-card'
import { CompanyDetailSidebar } from './company-detail-sidebar'
import { CompanyDetailUnlockedFieldsCard } from './company-detail-unlocked-fields-card'
import { CompanyDetailUnlockSuccessBanner } from './company-detail-unlock-success-banner'
import { useCompanyDetailDerived } from './use-company-detail-derived'

const routeApi = getRouteApi('/_protected/companies/$companyId')

export function CompanyDetailView() {
  const { companyId } = routeApi.useParams()
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const id = Number(companyId)
  const queryClient = useQueryClient()
  const { data: companyData } = useGetCompany(id)
  const company = companyData.data
  const reports = company.reports

  const [selectedReports, setSelectedReports] = useState<number[]>([])
  const [unlockingFieldId, setUnlockingFieldId] = useState<number | null>(null)
  const [unlockingAll, setUnlockingAll] = useState(false)
  const [showUnlockSuccessBanner, setShowUnlockSuccessBanner] = useState(false)

  const {
    getLockedFieldByFieldName,
    purchasedUnlockFields,
    publicFields,
    lockedFields,
    totalUnlockPrice,
    partnersRaw,
    managersRaw,
    partnersIsList,
    managersIsList,
    showPartnersManagersCard,
  } = useCompanyDetailDerived(company)

  useEffect(() => {
    if (search.unlock === 'success') {
      setShowUnlockSuccessBanner(true)
      queryClient.invalidateQueries({
        queryKey: getCompanyQueryOptions(id).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getUnlocksQueryOptions().queryKey,
      })
      navigate({ to: '.', search: { unlock: undefined } })
      const t = setTimeout(() => setShowUnlockSuccessBanner(false), 5000)
      return () => clearTimeout(t)
    }
  }, [id, queryClient, search.unlock, navigate])

  const toggleReport = useCallback((reportId: number) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((x) => x !== reportId)
        : [...prev, reportId],
    )
  }, [])

  const handleUnlock = useCallback(
    async (lockedFieldId: number) => {
      setUnlockingFieldId(lockedFieldId)
      try {
        const base = import.meta.env.VITE_HOME_URL
        const { url } = await createUnlockPaymentSession(
          lockedFieldId,
          `${base}/companies/${id}?unlock=success`,
          `${base}/companies/${id}?unlock=cancelled`,
        )
        window.location.href = url
      } catch {
        setUnlockingFieldId(null)
      }
    },
    [id],
  )

  const handleUnlockAll = useCallback(async () => {
    const ids = lockedFields
      .map(({ key }) => getLockedFieldByFieldName(key)?.id)
      .filter((x): x is number => x != null)
    if (ids.length === 0) return
    setUnlockingAll(true)
    try {
      const base = window.location.origin
      const { url } = await createUnlockAllPaymentSession(
        ids,
        `${base}/companies/${id}?unlock=success`,
        `${base}/companies/${id}?unlock=cancelled`,
      )
      window.location.href = url
    } catch {
      setUnlockingAll(false)
    }
  }, [id, lockedFields, getLockedFieldByFieldName])

  return (
    <div className="space-y-6 pb-12">
      <CompanyDetailBreadcrumb nameEn={company.nameEn} />

      {showUnlockSuccessBanner && <CompanyDetailUnlockSuccessBanner />}

      <CompanyDetailHero
        nameEn={company.nameEn}
        nameAr={company.nameAr}
        industry={company.industry}
        country={company.country}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          <CompanyDetailPremiumLockedCard
            lockedFields={lockedFields}
            totalUnlockPrice={totalUnlockPrice}
            getLockedField={getLockedFieldByFieldName}
            unlockingFieldId={unlockingFieldId}
            unlockingAll={unlockingAll}
            onUnlockField={handleUnlock}
            onUnlockAll={handleUnlockAll}
          />

          <CompanyDetailUnlockedFieldsCard fields={purchasedUnlockFields} />

          <CompanyDetailProfileCard publicFields={publicFields} />

          {showPartnersManagersCard && (
            <CompanyDetailPartnersManagersCard
              partnersRaw={partnersRaw}
              managersRaw={managersRaw}
              partnersIsList={partnersIsList}
              managersIsList={managersIsList}
            />
          )}

          <CompanyDetailComplianceCard
            companyId={id}
            reports={reports}
            selectedReports={selectedReports}
            onToggleReport={toggleReport}
          />
        </div>

        <CompanyDetailSidebar
          country={company.country}
          industry={company.industry}
          legalForm={company.legalForm}
          lockedFieldCount={lockedFields.length}
        />
      </div>
    </div>
  )
}
