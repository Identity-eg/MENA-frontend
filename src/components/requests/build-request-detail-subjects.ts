import type { TRequest } from '@/types/request'
import type {
  RequestDetailReportRow,
  RequestDetailSubjectItem,
} from './request-detail-types'
import type { RequestReportItem } from '@/types/request'

/** Unified request reports (prefer requestReports; empty when none). */
export function getRequestReports(
  request: TRequest | undefined,
): Array<RequestReportItem> {
  return request?.requestReports ?? []
}

/** Build subjects from requestReports. Backend only returns requestReports (no companies/individuals/reports). */
export function buildRequestDetailSubjects(
  request: TRequest | undefined,
): Array<RequestDetailSubjectItem> {
  const requestReports = getRequestReports(request)
  if (requestReports.length === 0) return []

  const companyMap = new Map<
    number,
    {
      name: string
      nationality: string
      reports: Array<RequestDetailReportRow>
    }
  >()
  const individualMap = new Map<
    number,
    {
      name: string
      nationality: string
      reports: Array<RequestDetailReportRow>
    }
  >()

  for (const rr of requestReports) {
    const price = rr.report.price ?? rr.report.estimatedPrice ?? 0
    const reportWithUploads: RequestDetailReportRow = {
      ...rr.report,
      totalEstimatedPrice: rr.report.totalEstimatedPrice ?? price,
      price,
      upload: rr.upload ?? null,
      reportStatus: rr.status,
      finalPrice: rr.finalPrice ?? null,
    }

    if (rr.companyId != null && rr.company != null) {
      const existing = companyMap.get(rr.companyId)
      const name = rr.company.nameAr ?? rr.company.nameEn
      const nationality = rr.company.country
        ? String(rr.company.country.nameEn)
        : '—'
      if (existing) {
        const idx = existing.reports.findIndex(
          (r) => r.id === reportWithUploads.id,
        )
        if (idx >= 0) {
          const existingReport = existing.reports[idx] as RequestDetailReportRow
          if (!existingReport.upload && reportWithUploads.upload) {
            existingReport.upload = reportWithUploads.upload
          }
        } else {
          existing.reports.push(reportWithUploads)
        }
      } else {
        companyMap.set(rr.companyId, {
          name,
          nationality,
          reports: [reportWithUploads],
        })
      }
    }

    if (rr.individualId != null && rr.individual != null) {
      const existing = individualMap.get(rr.individualId)
      const name =
        rr.individual.nameEn?.trim() || rr.individual.nameAr
      const nationality =
        rr.individual.country?.nameEn ?? rr.individual.countryCode ?? '—'
      if (existing) {
        const idx = existing.reports.findIndex(
          (r) => r.id === reportWithUploads.id,
        )
        if (idx >= 0) {
          const existingReport = existing.reports[idx] as RequestDetailReportRow
          if (!existingReport.upload && reportWithUploads.upload) {
            existingReport.upload = reportWithUploads.upload
          }
        } else {
          existing.reports.push(reportWithUploads)
        }
      } else {
        individualMap.set(rr.individualId, {
          name,
          nationality,
          reports: [reportWithUploads],
        })
      }
    }
  }

  const companySubjects: Array<RequestDetailSubjectItem> = Array.from(
    companyMap.entries(),
  ).map(([companyId, { name, nationality, reports }]) => ({
    id: `company-${companyId}`,
    name,
    type: 'Company' as const,
    nationality,
    reports,
  }))
  const individualSubjects: Array<RequestDetailSubjectItem> = Array.from(
    individualMap.entries(),
  ).map(([individualId, { name, nationality, reports }]) => ({
    id: `individual-${individualId}`,
    name,
    type: 'Individual' as const,
    nationality,
    reports,
  }))

  return [...companySubjects, ...individualSubjects]
}
