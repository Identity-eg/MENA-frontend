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

/** Request report (line) status enum values */
export const REQUEST_REPORT_STATUS = {
  UNDER_REVIEW: 'UNDER_REVIEW',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NEED_CLARIFICATION: 'NEED_CLARIFICATION',
} as const

export type RequestReportStatusValue = ValueOf<typeof REQUEST_REPORT_STATUS>

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
  totalEstimatedPrice: number
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
  status?: RequestReportStatusValue
  finalPrice?: number | null
  company?: TRequestCompany | null
  individual?: TIndividual | null
  report: RequestReport & { price?: number; estimatedPrice?: number }
  upload?: RequestReportUploadItem | null
}

/** Invoice shape when included on a request */
export type TRequestInvoice = {
  id: number
  requestId: number
  amount: number
  status: string
  invoiceNumber?: string
}

/** Single request from GET /api/requests and GET /api/requests/:id */
export type TRequest = {
  id: number
  userId: number
  status: RequestStatusValue
  totalEstimatedPrice: number
  notes: string | null
  createdAt: string
  updatedAt: string
  /** Present when request has an invoice */
  invoice?: TRequestInvoice | null
  /** Report lines (Prisma RequestReport). Source of truth for companies, individuals, reports. */
  requestReports?: Array<RequestReportItem>
  /** Optional: derived companies (GET /api/requests list adds these) */
  companies?: Array<TCompany | TRequestCompany>
  /** Optional: derived individuals (derive from requestReports when absent) */
  individuals?: Array<TIndividual>
  /** Optional: derived reports (GET /api/requests list adds these) */
  reports?: Array<TReport>
}
