import type { TReport } from './report'

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

export type TSensitiveFieldKey =
  'registrationNumber' | 'partners' | 'managers' | 'authSignatories'

export type TSensitiveFieldState = 'locked' | 'unlocked' | 'unavailable'

/**
 * One Sensitive field of a company as GET /api/companies/:id shows it to the viewer.
 * Label, Field cost (in Credits) and order come from the server. `value` is sent only
 * when the viewer may see it (unlocked, or an admin); a locked value is never sent.
 */
export type TSensitiveField = {
  key: TSensitiveFieldKey
  label: string
  cost: number
  state: TSensitiveFieldState
  value?: string | Array<TPartner> | Array<TManager> | Array<TAuthSignatory>
}

/** The server's "Unlock all" offer: every locked field, in display order, for their summed Field cost. */
export type TUnlockAllOffer = {
  total: number
  fieldKeys: Array<TSensitiveFieldKey>
}

export type TCompany = {
  id: number
  companyNameAr: string
  companyNameEn?: string | null
  UNN?: string | null
  centralNumber?: string | null
  civilId?: string | null
  legalForm?: string | null
  classification?: string | null
  estDate: string
  expiryDate?: string | null
  capital?: string | null
  branshes: Array<string>
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
  /** Registration number, partners, managers and signatories live only here. */
  sensitiveFields: Array<TSensitiveField>
  /** null when fewer than two fields remain locked (or for admins). */
  unlockAll: TUnlockAllOffer | null
  reports: Array<TReport>
  createdAt: string
  updatedAt: string
}
