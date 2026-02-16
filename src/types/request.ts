import type { ValueOf } from './value-of'
import type { TIndividual } from './individual'
import type { TCompany } from './company'
import type { TReport } from './report'

/** Backend request status enum values */
export const REQUEST_STATUS = {
  UNDER_REVIEW: 'UNDER_REVIEW',
  INVOICE_GENERATED: 'INVOICE_GENERATED',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const

export type RequestStatusValue = ValueOf<typeof REQUEST_STATUS>

/** Minimal company shape in request list/detail */
export type TRequestCompany = {
  id: number
  nameEn: string
  nameAr: string | null
  /** Present in GET /api/requests/:id response */
  country?: { code: string; nameEn: string; nameAr: string }
}

/** Per-company report selection when creating a request */
export type CreateRequestCompanyItem = {
  companyId: number
  reportIds: Array<number>
}

/** Per-individual data + report selection when creating a request */
export type CreateRequestIndividualItem = {
  fullName: string
  email?: string | null
  phone?: string | null
  position?: string | null
  nationality?: string | null
  dateOfBirth?: string | null
  idNumber?: string | null
  address?: string | null
  city?: string | null
  countryCode?: string | null
  reportIds: Array<number>
}

/** Payload for creating a request (per-company and per-individual report selection) */
export type CreateCompanyRequestPayload = {
  companiesReports?: Array<CreateRequestCompanyItem>
  individualsReports?: Array<CreateRequestIndividualItem>
  notes?: string | null
}

/** Report shape as included in request list/detail (backend sends price = estimatedPrice) */
export type RequestReport = {
  id: number
  name: string
  description: string
  turnaround: string
  estimatedPrice: number
  price?: number
  isActive?: boolean
}

/** Upload for a company report (from GET request by id) */
export type RequestCompanyReportUploadItem = {
  id: number
  fileUrl: string
  fileName: string | null
  /** Full URL to download the file (from backend) */
  downloadUrl?: string
}

/** Junction: which report is requested for which company (aligned with RequestCompanyReport) */
export type RequestCompanyReportItem = {
  requestId: number
  companyId: number
  reportId: number
  company: TRequestCompany
  report: RequestReport & { price: number }
  upload?: RequestCompanyReportUploadItem | null
}

/** Upload for an individual report (from GET request by id) */
export type RequestIndividualReportUploadItem = {
  id: number
  fileUrl: string
  fileName: string | null
  /** Full URL to download the file (from backend) */
  downloadUrl?: string
}

/** Junction: which report is requested for which individual (aligned with RequestIndividualReport) */
export type RequestIndividualReportItem = {
  requestId: number
  individualId: number
  reportId: number
  individual: TIndividual
  report: RequestReport & { price: number }
  upload?: RequestIndividualReportUploadItem | null
}

/** Upload for a request report (company or individual); backend model: RequestReportUpload */
export type RequestReportUploadItem = {
  id: number
  fileUrl: string
  fileName: string | null
  downloadUrl?: string
}

/** Unified request report row (backend model: RequestReport). Exactly one of company or individual is set. */
export type RequestReportItem = {
  id: number
  requestId: number
  reportId: number
  companyId?: number | null
  individualId?: number | null
  company?: TRequestCompany | null
  individual?: TIndividual | null
  report: RequestReport & { price?: number; estimatedPrice?: number }
  upload?: RequestReportUploadItem | null
}

/** Single request from GET /api/requests and GET /api/requests/:id */
export type TRequest = {
  id: number
  userId: number
  status: RequestStatusValue
  estimatedPrice: number
  finalPrice: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
  /** Unique companies in this request */
  companies: Array<TCompany | TRequestCompany>
  /** Individuals in this request */
  individuals: Array<TIndividual>
  /** All unique reports in this request */
  reports: Array<TReport>
  /** Unified report lines (backend model: RequestReport). Prefer this over the legacy arrays. */
  requestReports?: Array<RequestReportItem>
  /** @deprecated Use requestReports filtered by companyId. Per-company report assignments. */
  requestCompanyReports?: Array<RequestCompanyReportItem>
  /** @deprecated Use requestReports filtered by individualId. Per-individual report assignments. */
  requestIndividualReports?: Array<RequestIndividualReportItem>
}
