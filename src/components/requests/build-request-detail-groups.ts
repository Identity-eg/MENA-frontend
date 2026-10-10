import {
  getLinePrice,
  isLineRefundDue,
  isLineRejected,
} from '@/lib/request-billing'
import {
  getRequestCompanies,
  type RequestCompanyName,
} from '@/lib/request-display'
import {
  REQUEST_REPORT_STATUS,
  type RequestReportStatusValue,
  type TRequest,
} from '@/types/request'

/** One Request line as the request page shows it. */
export type RequestDetailLine = {
  id: number
  reportId: number
  reportName: string
  status: RequestReportStatusValue
  /** finalPrice ?? estimatedPrice */
  price: number
  estimatedPrice: number
  /** Frozen at invoicing; null until then. */
  finalPrice: number | null
  rejected: boolean
  refundDue: boolean
  uploadId: number | null
}

export type RequestDetailCompanyGroup = {
  company: RequestCompanyName
  country: string | null
  lines: Array<RequestDetailLine>
}

/** Request lines grouped by company, in line order. */
export function buildRequestDetailGroups(
  request: Pick<TRequest, 'requestReports' | 'companies'>,
): Array<RequestDetailCompanyGroup> {
  const companies = new Map(getRequestCompanies(request).map((c) => [c.id, c]))
  const groups = new Map<number, RequestDetailCompanyGroup>()

  for (const rr of request.requestReports ?? []) {
    if (rr.companyId == null) continue
    const company = companies.get(rr.companyId)
    if (!company) continue

    let group = groups.get(rr.companyId)
    if (!group) {
      group = {
        company,
        country: rr.company?.country?.nameEn ?? null,
        lines: [],
      }
      groups.set(rr.companyId, group)
    }

    group.lines.push({
      id: rr.id,
      reportId: rr.reportId,
      reportName: rr.report.name,
      status: rr.status ?? REQUEST_REPORT_STATUS.PENDING,
      price: getLinePrice(rr),
      estimatedPrice: rr.report.estimatedPrice ?? rr.report.price ?? 0,
      finalPrice: rr.finalPrice ?? null,
      rejected: isLineRejected(rr),
      refundDue: isLineRefundDue(rr),
      uploadId: rr.upload?.id ?? null,
    })
  }

  return Array.from(groups.values())
}
