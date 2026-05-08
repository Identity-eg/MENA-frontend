import type { TLockedField } from './locked-field'
import type { TReport } from './report'

/** Masked locked value from API (see maskCompanyLockedFields). */
export const COMPANY_MASKED_VALUE = '••••••'

export type TPartner = {
  id?: number
  type: string // "Partner" or "Manager" or "Auth.Sig"
  nameAr: string
  nameEn?: string | null
  idNumber?: string | null
  nationalityAr?: string | null
  nationalityEn?: string | null
  percentage?: string | null
  numberOfShares?: string | null
  statusAr?: string | null
  statusEn?: string | null
  SNumber?: string | null
  designationAr?: string | null
  designationEn?: string | null
  roleAr?: string | null
  roleEn?: string | null
  civilId?: string | null
  ownerTypeDescription?: string | null
  occupation?: string | null
  residentialCity?: string | null
  dateOfBirth?: string | null
}

export type TManager = {
  id?: number
  nameAr: string
  nameEn?: string | null
  idNumber?: string | null
  nationalityAr?: string | null
  nationalityEn?: string | null
  statusAr?: string | null
  statusEn?: string | null
  SNumber?: string | null
  positionAr?: string | null
  positionEn?: string | null
  roleAr?: string | null
  roleEn?: string | null
  assignDate?: string | null
  civilId?: string | null
  civilEndDate?: string | null
  dateOfBirth?: string | null
  fromDate?: string | null
  toDate?: string | null
  address?: string | null
  email?: string | null
  mobile?: string | null
  passportNumber?: string | null
  passportIssueDate?: string | null
  passportEndDate?: string | null
}

export type TAuthSignatory = {
  id?: number
  nameAr: string
  nameEn?: string | null
  idNumber?: string | null
  nationalityAr?: string | null
  nationalityEn?: string | null
  signatureLevelAr?: string | null
  signatureLevelEn?: string | null
  authorizationLimitAr?: string | null
  authorizationLimitEn?: string | null
  designationAr?: string | null
  designationEn?: string | null
  assignDate?: string | null
  text?: string | null
}

export type TCompany = {
  id: number
  companyNameAr: string
  companyNameEn?: string | null
  registrationNumber: string
  UNN?: string | null
  centralNumber?: string | null
  civilId?: string | null
  legalForm?: string | null
  classification?: string | null
  estDate: string
  expiryDate?: string | null
  capital?: string | null
  branshes: string[]
  status: string
  entityNumber?: string | null
  TaxRegNumber?: string | null
  unifiedEconomicNumber?: string | null
  bcciIssueDate?: string | null
  bcciExpiryDate?: string | null
  businessNameAr?: string | null
  businessNameEn?: string | null
  licenseCategory?: string | null
  licenseNumber?: string | null
  mainLicenseNumber?: string | null
  dcciNumber?: string | null
  D_B_dunsNumber?: string | null
  licenseTarget?: string | null
  lastBudgetStatus?: string | null
  amendDate?: string | null
  amendType?: string | null
  amendDescription?: string | null
  activityCode?: string | null
  activityName?: string | null
  activityStatus?: string | null
  activity_ISICCode?: string | null
  sectorDescription?: string | null
  totalShares?: string | null
  shareValue?: string | null
  currency?: string | null
  paid?: string | null
  totalCapital?: string | null
  cashCapital?: string | null
  assetCapital?: string | null
  nominated?: string | null
  auth?: string | null
  countryCode: string
  country: {
    code: string
    nameEn: string
    nameAr: string
  }
  lockedFields: Array<TLockedField>
  reports: Array<TReport>
  /** Present when unlocked; masked string when locked. */
  partners?: TPartner[] | string
  managers?: TManager[] | string
  authSignatories?: TAuthSignatory[] | string
  createdAt: string
  updatedAt: string
}
