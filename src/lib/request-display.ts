import type { TCompany } from '@/types/company'
import type { TRequest, TRequestCompany } from '@/types/request'

export function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount)
}

export type RequestCompanyName = {
  id: number
  companyNameEn: string
  companyNameAr: string | null
}

/** Unique companies of a Request, in line order (falls back to the list's `companies`). */
export function getRequestCompanies(
  request: Pick<TRequest, 'requestReports' | 'companies'>,
): Array<RequestCompanyName> {
  const seen = new Map<number, RequestCompanyName>()
  for (const line of request.requestReports ?? []) {
    if (line.company && !seen.has(line.company.id)) {
      seen.set(line.company.id, toCompanyName(line.company))
    }
  }
  if (seen.size === 0) {
    for (const c of request.companies ?? []) {
      if (!seen.has(c.id)) seen.set(c.id, toCompanyName(c))
    }
  }
  return Array.from(seen.values())
}

function toCompanyName(c: TCompany | TRequestCompany): RequestCompanyName {
  // A company may only have an Arabic name; show it as the primary name then.
  const en = c.companyNameEn?.trim() || null
  const ar = c.companyNameAr?.trim() || null
  return {
    id: c.id,
    companyNameEn: en ?? ar ?? '—',
    companyNameAr: en ? ar : null,
  }
}

/** "Acme Trading" or "Acme Trading +2 more" for compact rows. */
export function summarizeCompanies(companies: Array<RequestCompanyName>) {
  if (companies.length === 0) return '—'
  const [first, ...rest] = companies
  return rest.length > 0
    ? `${first.companyNameEn} +${rest.length} more`
    : first.companyNameEn
}
