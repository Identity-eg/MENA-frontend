import type { TLockedField } from './locked-field'
import type { TReport } from './report'

/** Masked locked value from API (see maskCompanyLockedFields). */
export const COMPANY_MASKED_VALUE = '••••••'

export type TCompanyPartner = {
  id?: number
  nameAr: string
  nameEn?: string | null
  idNumber: string
  percentage?: number | null
  nationality?: string | null
}

export type TCompanyManager = {
  id?: number
  nameAr: string
  nameEn?: string | null
  idNumber: string
  nationality?: string | null
  authority?: string | null
  position?: string | null
}

export type TCompany = {
  id: number
  nameEn: string
  nameAr: string | null
  registrationNumber: string
  legalForm: string
  industry: string
  foundedDate: string | null
  size: string | null
  address: string
  city: string
  country: {
    code: string
    nameEn: string
    nameAr: string
  }
  phone: string
  email: string
  website: string | null
  ticker: string | null
  description: string | null
  descriptionAr: string | null
  services: Array<string>
  aliases: Array<string>
  lockedFields: Array<TLockedField>
  reports: Array<TReport>
  /** Present when unlocked; masked string when locked. */
  partners?: TCompanyPartner[] | string
  managers?: TCompanyManager[] | string
  createdAt: string
}
