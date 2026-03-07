import type { TReport } from './report'

export type TIndividual = {
  id: number
  fullName: string
  email: string | null
  phone: string | null
  position: string | null
  nationality: string | null
  dateOfBirth: string | null
  idNumber: string | null
  address: string | null
  city: string | null
  countryCode: string | null
  country: {
    code: string
    nameEn: string
    nameAr: string
  } | null
  reports: Array<TReport>
  createdAt: string
  updatedAt: string
}
