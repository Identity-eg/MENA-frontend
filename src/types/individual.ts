import type { TReport } from './report'

export type TIndividual = {
  id: number
  nameAr: string
  nameEn: string | null
  email: string | null
  phone: string | null
  position: string | null
  dateOfBirth: string | null
  idNumber: string | null
  address: string | null
  city: string
  countryCode: string
  country: {
    code: string
    nameEn: string
    nameAr: string
  } | null
  reports: Array<TReport>
  createdAt: string
  updatedAt: string
}

export function displayIndividualName(individual: {
  nameAr: string
  nameEn?: string | null
}): string {
  const en = individual.nameEn?.trim()
  if (en) return en
  return individual.nameAr
}
