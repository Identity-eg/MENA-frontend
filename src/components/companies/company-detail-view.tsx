import { usePostHog } from '@posthog/react'
import { useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getErrorMessage } from '@/apis/base/error-handler'
import {
  getCompanyQueryOptions,
  useGetCompany,
} from '@/apis/company/get-company'
import { createUnlockAllPaymentSession } from '@/apis/unlocks/create-unlock-all-payment-session'
import { createUnlockPaymentSession } from '@/apis/unlocks/create-unlock-payment-session'
import { getUnlocksQueryOptions } from '@/apis/unlocks/get-unlocks'
import type { TCompany } from '@/types/company'
import { CompanyDetailBreadcrumb } from './company-detail-breadcrumb'
import { CompanyDetailComplianceCard } from './company-detail-compliance-card'
import { CompanyDetailHero } from './company-detail-hero'
import { CompanyDetailPartnersManagersCard } from './company-detail-partners-managers-card'
import { CompanyDetailPremiumLockedCard } from './company-detail-premium-locked-card'
import { CompanyDetailProfileCard } from './company-detail-profile-card'
import { CompanyDetailSidebar } from './company-detail-sidebar'
import {
  CompanyDetailUnlockSuccessBanner,
  type UnlockBannerState,
} from './company-detail-unlock-success-banner'
import { CompanyDetailUnlockedFieldsCard } from './company-detail-unlocked-fields-card'
import { useCompanyDetailDerived } from './use-company-detail-derived'

const routeApi = getRouteApi('/_protected/companies/$companyId')

/** After returning from Stripe, poll until the webhook grants the unlock. */
const UNLOCK_POLL_INTERVAL_MS = 3_000
const UNLOCK_POLL_TIMEOUT_MS = 60_000

function parseFieldIds(fields: string | undefined): Array<number> {
  if (!fields) return []
  return fields
    .split(',')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
}

/** True while any of the bought field offers still has no unlock for the viewer. */
function isAwaitingUnlock(company: TCompany, fieldIds: Array<number>) {
  return fieldIds.some((fieldId) => {
    const lockedField = company.lockedFields.find((lf) => lf.id === fieldId)
    return lockedField != null && lockedField.unlocks.length === 0
  })
}

export function CompanyDetailView() {
  const { companyId } = routeApi.useParams()
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const id = Number(companyId)
  const queryClient = useQueryClient()
  const posthog = usePostHog()

  const returnedFromUnlock = search.unlock === 'success'
  const boughtFieldIds = parseFieldIds(search.fields)
  const [unlockPollTimedOut, setUnlockPollTimedOut] = useState(false)

  const { data: companyData } = useGetCompany(id, {
    refetchInterval: (query) =>
      returnedFromUnlock &&
      !unlockPollTimedOut &&
      query.state.data != null &&
      isAwaitingUnlock(query.state.data.data, boughtFieldIds)
        ? UNLOCK_POLL_INTERVAL_MS
        : false,
  })
  const company = companyData.data
  const reports = company.reports

  const [selectedReports, setSelectedReports] = useState<Array<number>>([])
  const [unlockingFieldId, setUnlockingFieldId] = useState<number | null>(null)
  const [unlockingAll, setUnlockingAll] = useState(false)
  const [showUnlockSuccessBanner, setShowUnlockSuccessBanner] = useState(false)

  const awaitingUnlock =
    returnedFromUnlock && isAwaitingUnlock(company, boughtFieldIds)
  const unlockBannerState: UnlockBannerState | null = awaitingUnlock
    ? unlockPollTimedOut
      ? 'delayed'
      : 'unlocking'
    : showUnlockSuccessBanner
      ? 'unlocked'
      : null

  const {
    getLockedFieldByFieldName,
    purchasedUnlockFields,
    publicFields,
    lockedFields,
    totalUnlockPrice,
    partnersRaw,
    managersRaw,
    authSignatoriesRaw,
    partnersIsList,
    managersIsList,
    authSignatoriesIsList,
    partnersUnavailable,
    managersUnavailable,
    authSignatoriesUnavailable,
    showPartnersManagersCard,
  } = useCompanyDetailDerived(company)

  useEffect(() => {
    if (search.unlock !== 'cancelled') return
    toast.info('Payment cancelled. You have not been charged.')
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, unlock: undefined, fields: undefined }),
      replace: true,
    })
  }, [search.unlock, navigate])

  useEffect(() => {
    if (!returnedFromUnlock) return
    setUnlockPollTimedOut(false)
    const timer = setTimeout(
      () => setUnlockPollTimedOut(true),
      UNLOCK_POLL_TIMEOUT_MS,
    )
    return () => clearTimeout(timer)
  }, [returnedFromUnlock])

  useEffect(() => {
    if (!returnedFromUnlock || awaitingUnlock) return
    // Granted (or no field ids to wait for): refresh and clear the Stripe params.
    setShowUnlockSuccessBanner(true)
    queryClient.invalidateQueries({
      queryKey: getCompanyQueryOptions(id).queryKey,
    })
    queryClient.invalidateQueries({
      queryKey: getUnlocksQueryOptions().queryKey,
    })
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, unlock: undefined, fields: undefined }),
      replace: true,
    })
  }, [id, queryClient, returnedFromUnlock, awaitingUnlock, navigate])

  useEffect(() => {
    if (!showUnlockSuccessBanner) return
    const t = setTimeout(() => setShowUnlockSuccessBanner(false), 5000)
    return () => clearTimeout(t)
  }, [showUnlockSuccessBanner])

  const handleUnlockError = (error: unknown) => {
    const { message, status } = getErrorMessage(
      error,
      'Could not start the unlock checkout.',
    )
    toast.error(message)
    // 409 already unlocked / 404 offer gone: our copy of the company is stale.
    if (status === 409 || status === 404) {
      queryClient.invalidateQueries({
        queryKey: getCompanyQueryOptions(id).queryKey,
      })
    }
  }

  const toggleReport = (reportId: number) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((x) => x !== reportId)
        : [...prev, reportId],
    )
  }

  const handleUnlock = async (lockedFieldId: number) => {
    setUnlockingFieldId(lockedFieldId)
    try {
      const base = window.location.origin
      const { url } = await createUnlockPaymentSession(
        lockedFieldId,
        `${base}/companies/${id}?unlock=success&fields=${lockedFieldId}`,
        `${base}/companies/${id}?unlock=cancelled`,
      )
      posthog.capture('unlock_checkout_started', {
        company_id: id,
        unlock_type: 'single_field',
      })
      window.location.href = url
    } catch (error) {
      setUnlockingFieldId(null)
      handleUnlockError(error)
    }
  }

  const handleUnlockAll = async () => {
    const ids = lockedFields
      .map(({ key }) => getLockedFieldByFieldName(key)?.id)
      .filter((x): x is number => x != null)
    if (ids.length === 0) return
    setUnlockingAll(true)
    try {
      const base = window.location.origin
      const { url } = await createUnlockAllPaymentSession(
        ids,
        `${base}/companies/${id}?unlock=success&fields=${ids.join(',')}`,
        `${base}/companies/${id}?unlock=cancelled`,
      )
      posthog.capture('unlock_checkout_started', {
        company_id: id,
        unlock_type: 'all_fields',
        locked_field_count: ids.length,
      })
      window.location.href = url
    } catch (error) {
      setUnlockingAll(false)
      handleUnlockError(error)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <CompanyDetailBreadcrumb companyNameEn={company.companyNameEn ?? '—'} />

      {unlockBannerState && (
        <CompanyDetailUnlockSuccessBanner state={unlockBannerState} />
      )}

      <CompanyDetailHero
        companyNameEn={company.companyNameEn}
        companyNameAr={company.companyNameAr}
        activityName={company.activityName}
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

          <CompanyDetailProfileCard publicFields={publicFields}>
            {showPartnersManagersCard && (
              <CompanyDetailPartnersManagersCard
                partnersRaw={partnersRaw}
                managersRaw={managersRaw}
                authSignatoriesRaw={authSignatoriesRaw}
                partnersIsList={partnersIsList}
                managersIsList={managersIsList}
                authSignatoriesIsList={authSignatoriesIsList}
                partnersUnavailable={partnersUnavailable}
                managersUnavailable={managersUnavailable}
                authSignatoriesUnavailable={authSignatoriesUnavailable}
              />
            )}
          </CompanyDetailProfileCard>

          <CompanyDetailComplianceCard
            companyId={id}
            reports={reports}
            selectedReports={selectedReports}
            onToggleReport={toggleReport}
          />
        </div>

        <CompanyDetailSidebar
          country={company.country}
          activityName={company.activityName}
          legalForm={company.legalForm}
          lockedFieldCount={lockedFields.length}
        />
      </div>
    </div>
  )
}
