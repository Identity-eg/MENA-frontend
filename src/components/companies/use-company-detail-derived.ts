import { useMemo } from 'react'
import type { TCompany } from '@/types/company'
import type { CompanyProfileFieldRow } from './company-detail-types'

export type CompanyDetailDerived = {
  getLockedFieldByFieldName: (fieldName: string) =>
    | TCompany['lockedFields'][number]
    | undefined
  profileFields: CompanyProfileFieldRow[]
  purchasedUnlockFields: CompanyProfileFieldRow[]
  publicFields: CompanyProfileFieldRow[]
  profileLockedFields: CompanyProfileFieldRow[]
  peopleLockedExtras: CompanyProfileFieldRow[]
  lockedFields: CompanyProfileFieldRow[]
  totalUnlockPrice: number
  partnersRaw: TCompany['partners']
  managersRaw: TCompany['managers']
  authSignatoriesRaw: TCompany['authSignatories']
  partnersIsList: boolean
  managersIsList: boolean
  authSignatoriesIsList: boolean
  showPartnersManagersCard: boolean
}

export function useCompanyDetailDerived(company: TCompany): CompanyDetailDerived {
  return useMemo(() => {
    const getLockedFieldByFieldName = (fieldName: string) =>
      company.lockedFields.find((lf) => lf.lockedType.fieldName === fieldName)

    const profileFields: CompanyProfileFieldRow[] = [
      {
        key: 'registrationNumber',
        label: 'Registration Number',
        value: company.registrationNumber,
      },
      { key: 'UNN', label: 'UNN (Jordan-Saudi-Egypt)', value: company.UNN },
      { key: 'centralNumber', label: 'Central Number (Kuwait)', value: company.centralNumber },
      { key: 'civilId', label: 'Civil ID (Kuwait)', value: company.civilId },
      { key: 'legalForm', label: 'Legal Type', value: company.legalForm },
      { key: 'classification', label: 'Classification', value: company.classification },
      { key: 'estDate', label: 'Est. Date', value: company.estDate },
      { key: 'expiryDate', label: 'Expiry Date', value: company.expiryDate },
      { key: 'capital', label: 'Capital', value: company.capital },
      { key: 'status', label: 'Status', value: company.status },
      { key: 'entityNumber', label: 'Entity Number (Qatar)', value: company.entityNumber },
      { key: 'TaxRegNumber', label: 'Tax Reg Number (Qatar)', value: company.TaxRegNumber },
      { key: 'unifiedEconomicNumber', label: 'Unified Economic Number (Qatar)', value: company.unifiedEconomicNumber },
      { key: 'bcciIssueDate', label: 'BCCI Issue Date (Bahrain)', value: company.bcciIssueDate },
      { key: 'bcciExpiryDate', label: 'BCCI Expiry Date (Bahrain)', value: company.bcciExpiryDate },
      { key: 'businessNameAr', label: 'Business Name (Ar) (Dubai)', value: company.businessNameAr },
      { key: 'businessNameEn', label: 'Business Name (En) (Dubai)', value: company.businessNameEn },
      { key: 'licenseCategory', label: 'License Category (Dubai)', value: company.licenseCategory },
      { key: 'licenseNumber', label: 'License Number (Dubai)', value: company.licenseNumber },
      { key: 'mainLicenseNumber', label: 'Main License Number (Dubai)', value: company.mainLicenseNumber },
      { key: 'dcciNumber', label: 'DCCI Number (Dubai)', value: company.dcciNumber },
      { key: 'D_B_dunsNumber', label: 'D&B Duns Number (Dubai)', value: company.D_B_dunsNumber },
      { key: 'licenseTarget', label: 'License Target (Kuwait)', value: company.licenseTarget },
      { key: 'lastBudgetStatus', label: 'Last Budget Status (Kuwait)', value: company.lastBudgetStatus },
      
      { key: 'amendDate', label: 'Amend Date', value: company.amendDate },
      { key: 'amendType', label: 'Amend Type', value: company.amendType },
      { key: 'amendDescription', label: 'Amend Description', value: company.amendDescription },

      { key: 'activityCode', label: 'Activity Code', value: company.activityCode },
      { key: 'activityName', label: 'Activity Name', value: company.activityName },
      { key: 'activityStatus', label: 'Activity Status', value: company.activityStatus },
      { key: 'activity_ISICCode', label: 'Activity ISIC Code (Oman)', value: company.activity_ISICCode },
      { key: 'sectorDescription', label: 'Sector Description (Kuwait-Saudi)', value: company.sectorDescription },

      { key: 'totalShares', label: 'Total Shares', value: company.totalShares },
      { key: 'shareValue', label: 'Share Value', value: company.shareValue },
      { key: 'currency', label: 'Currency', value: company.currency },
      { key: 'paid', label: 'Paid', value: company.paid },
      { key: 'totalCapital', label: 'Total Capital', value: company.totalCapital },
      { key: 'cashCapital', label: 'Cash Capital', value: company.cashCapital },
      { key: 'assetCapital', label: 'Asset Capital', value: company.assetCapital },
      { key: 'nominated', label: 'Nominated', value: company.nominated },
      { key: 'auth', label: 'Auth', value: company.auth },

      { key: 'country', label: 'Country', value: company.country.nameEn },
    ]

    const purchasedUnlockFields = profileFields.filter(({ key }) => {
      const locked = getLockedFieldByFieldName(key)
      return locked != null && locked.unlocks.length > 0
    })

    const publicFields = profileFields.filter(({ key }) => {
      const locked = getLockedFieldByFieldName(key)
      return locked == null
    })

    const profileLockedFields = profileFields.filter(({ key, value }) => {
      // Don't show empty fields as locked if they are null
      if (value === null || value === undefined) return false
      const locked = getLockedFieldByFieldName(key)
      return locked != null && locked.unlocks.length === 0
    })

    const partnersRaw = company.partners
    const managersRaw = company.managers
    const authSignatoriesRaw = company.authSignatories

    const partnersIsList = Array.isArray(partnersRaw)
    const managersIsList = Array.isArray(managersRaw)
    const authSignatoriesIsList = Array.isArray(authSignatoriesRaw)

    const peopleLockedExtras: CompanyProfileFieldRow[] = []

    // 1. Check individual locks (partners, managers, authSignatories)
    const partnersLock = getLockedFieldByFieldName('partners')
    if (partnersLock && partnersLock.unlocks.length === 0 && typeof partnersRaw === 'string') {
      peopleLockedExtras.push({
        key: 'partners',
        label: 'Partners',
        value: partnersRaw,
      })
    }

    const managersLock = getLockedFieldByFieldName('managers')
    if (managersLock && managersLock.unlocks.length === 0 && typeof managersRaw === 'string') {
      peopleLockedExtras.push({
        key: 'managers',
        label: 'Managers',
        value: managersRaw,
      })
    }

    const authSignatoriesLock = getLockedFieldByFieldName('authSignatories')
    if (
      authSignatoriesLock &&
      authSignatoriesLock.unlocks.length === 0 &&
      typeof authSignatoriesRaw === 'string'
    ) {
      peopleLockedExtras.push({
        key: 'authSignatories',
        label: 'Authorized Signatories',
        value: authSignatoriesRaw,
      })
    }

    const lockedFields = [...profileLockedFields, ...peopleLockedExtras]

    const totalUnlockPrice = lockedFields.reduce((sum, { key }) => {
      const locked = getLockedFieldByFieldName(key)
      return sum + (locked?.price ?? 0)
    }, 0)

    const showPartnersManagersCard =
      partnersRaw !== undefined ||
      managersRaw !== undefined ||
      authSignatoriesRaw !== undefined ||
      partnersIsList ||
      managersIsList ||
      authSignatoriesIsList ||
      peopleLockedExtras.length > 0

    return {
      getLockedFieldByFieldName,
      profileFields,
      purchasedUnlockFields,
      publicFields,
      profileLockedFields,
      peopleLockedExtras,
      lockedFields,
      totalUnlockPrice,
      partnersRaw,
      managersRaw,
      authSignatoriesRaw,
      partnersIsList,
      managersIsList,
      authSignatoriesIsList,
      showPartnersManagersCard,
    }
  }, [company])
}
