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
  partnersIsList: boolean
  managersIsList: boolean
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
      { key: 'legalForm', label: 'Legal Type', value: company.legalForm },
      { key: 'industry', label: 'Industry', value: company.industry },
      { key: 'foundedDate', label: 'Founded', value: company.foundedDate },
      { key: 'size', label: 'Size', value: company.size },
      { key: 'address', label: 'Address', value: company.address },
      { key: 'city', label: 'City', value: company.city },
      { key: 'country', label: 'Country', value: company.country.nameEn },
      { key: 'phone', label: 'Phone', value: company.phone },
      { key: 'email', label: 'Email', value: company.email },
      { key: 'website', label: 'Website', value: company.website },
      {
        key: 'description',
        label: 'Description',
        value: company.description,
      },
    ]

    const purchasedUnlockFields = profileFields.filter(({ key }) => {
      const locked = getLockedFieldByFieldName(key)
      return locked != null && locked.unlocks.length > 0
    })

    const publicFields = profileFields.filter(({ key }) => {
      const locked = getLockedFieldByFieldName(key)
      return locked == null
    })

    const profileLockedFields = profileFields.filter(({ key }) => {
      const locked = getLockedFieldByFieldName(key)
      return locked != null && locked.unlocks.length === 0
    })

    const partnersRaw = company.partners
    const managersRaw = company.managers
    const partnersIsList = Array.isArray(partnersRaw)
    const managersIsList = Array.isArray(managersRaw)

    const peopleLockedExtras: CompanyProfileFieldRow[] = []
    if (
      !partnersIsList &&
      typeof partnersRaw === 'string' &&
      getLockedFieldByFieldName('partners')?.unlocks.length === 0
    ) {
      peopleLockedExtras.push({
        key: 'partners',
        label: 'Partners & shareholders',
        value: partnersRaw,
      })
    }
    if (
      !managersIsList &&
      typeof managersRaw === 'string' &&
      getLockedFieldByFieldName('managers')?.unlocks.length === 0
    ) {
      peopleLockedExtras.push({
        key: 'managers',
        label: 'Managers',
        value: managersRaw,
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
      partnersIsList ||
      managersIsList ||
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
      partnersIsList,
      managersIsList,
      showPartnersManagersCard,
    }
  }, [company])
}
