import type { TLockedField } from './locked-field'
import type { TReport } from './report'

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
  description: string | null
  services: Array<string>
  lockedFields: Array<TLockedField>
  reports: Array<TReport>
  createdAt: string
}
