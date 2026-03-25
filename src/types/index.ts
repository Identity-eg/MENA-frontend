/**
 * Barrel for `@/types` imports.
 */
export type { TIndividual } from './individual'
export { displayIndividualName } from './individual'
export type {
  TRequest,
  CreateCompanyRequestPayload,
  CreateRequestCompanyItem,
  CreateRequestIndividualItem,
  RequestReportItem,
} from './request'
export { REQUEST_STATUS } from './request'
export type { RequestStatusValue as RequestStatus } from './request'

export type { TCompany } from './company'
export type { TReport } from './report'

/** Wizard subjects (company vs individual screening) */
export type Subject =
  | {
      id: string
      type: 'Individual'
      nameAr: string
      nameEn?: string
      country?: string
      idNumber?: string
      email?: string
    }
  | {
      id: string
      type: 'Company'
      companyName?: string
      country?: string
      registrationNumber?: string
    }

/** Legacy service row (catalog / request flows) */
export type Service = {
  id: string
  name: string
  description?: string
  estimatedPrice?: number
  estimatedPriceUsd?: number
  estimatedTatDays?: number
  turnaround?: string
}

export type RequestService = {
  id: string
  name?: string
  serviceName?: string
  serviceId?: string
  status: 'pending' | 'included' | 'completed'
  estimatedPrice?: number
  finalTatDays?: number | null
  finalPriceUsd?: number | null
  pdfUrl?: string | null
}

export type Comment = {
  id: string
  body: string
  createdAt: string
  authorType: 'user' | 'admin' | 'system'
  authorEmail?: string | null
}
