import { Link, createFileRoute } from '@tanstack/react-router'
import { CreditCard, Download, Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { RequestReportItem, TRequest } from '@/types/request'
import {
  getRequestsQueryOptions,
  useGetRequests,
} from '@/apis/requests/get-requests'
import { REQUEST_STATUS } from '@/types/request'
import { PageHeader } from '@/components/page-header'
import { StatusPill } from '@/components/StatusPill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/_protected/requests/')({
  component: RequestsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRequestsQueryOptions())
    return {}
  },
})

function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

function formatPrice(estimatedPrice: number, finalPrice: number | null) {
  const amount = finalPrice ?? estimatedPrice
  return `$${amount}`
}

/** Normalize to unified request reports (from requestReports or legacy requestCompanyReports + requestIndividualReports) */
function getRequestReports(req: TRequest): Array<RequestReportItem> {
  if (req.requestReports?.length) return req.requestReports
  const company = (req.requestCompanyReports ?? []).map((rcr) => ({
    id: 0,
    requestId: rcr.requestId,
    reportId: rcr.reportId,
    companyId: rcr.companyId,
    individualId: null as number | null,
    company: rcr.company,
    individual: null,
    report: rcr.report,
    upload: rcr.upload ?? null,
  }))
  const individual = (req.requestIndividualReports ?? []).map((rir) => ({
    id: 0,
    requestId: rir.requestId,
    reportId: rir.reportId,
    companyId: null as number | null,
    individualId: rir.individualId,
    company: null,
    individual: rir.individual,
    report: rir.report,
    upload: rir.upload ?? null,
  }))
  return [...company, ...individual]
}

/** Per-company reports (derived from requestReports) */
function getCompanyWithReports(req: TRequest): Array<{
  company: NonNullable<RequestReportItem['company']>
  reports: Array<{ id: number; name: string }>
}> {
  const items = getRequestReports(req).filter(
    (
      rr,
    ): rr is RequestReportItem & {
      company: NonNullable<RequestReportItem['company']>
    } => rr.companyId != null && rr.company != null,
  )
  const byCompany = new Map<
    number,
    {
      company: NonNullable<RequestReportItem['company']>
      reports: Map<number, { id: number; name: string }>
    }
  >()
  for (const rr of items) {
    const key = rr.company!.id
    if (!byCompany.has(key)) {
      byCompany.set(key, { company: rr.company!, reports: new Map() })
    }
    byCompany
      .get(key)!
      .reports.set(rr.report.id, { id: rr.report.id, name: rr.report.name })
  }
  return Array.from(byCompany.values()).map(({ company, reports }) => ({
    company,
    reports: Array.from(reports.values()),
  }))
}

/** Per-individual reports (derived from requestReports) */
function getIndividualWithReports(req: TRequest): Array<{
  individual: NonNullable<RequestReportItem['individual']>
  reports: Array<{ id: number; name: string }>
}> {
  const items = getRequestReports(req).filter(
    (
      rr,
    ): rr is RequestReportItem & {
      individual: NonNullable<RequestReportItem['individual']>
    } => rr.individualId != null && rr.individual != null,
  )
  const byIndividual = new Map<
    number,
    {
      individual: NonNullable<RequestReportItem['individual']>
      reports: Map<number, { id: number; name: string }>
    }
  >()
  for (const rr of items) {
    const key = rr.individual!.id
    if (!byIndividual.has(key)) {
      byIndividual.set(key, { individual: rr.individual!, reports: new Map() })
    }
    byIndividual
      .get(key)!
      .reports.set(rr.report.id, { id: rr.report.id, name: rr.report.name })
  }
  return Array.from(byIndividual.values()).map(({ individual, reports }) => ({
    individual,
    reports: Array.from(reports.values()),
  }))
}

function RequestsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data } = useGetRequests()
  const requests: Array<TRequest> = data.data ?? []

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      const requestIdStr = formatRequestId(req.id)
      const searchLower = search.toLowerCase()
      const companyMatch = (req.companies ?? []).some(
        (c) =>
          c.nameEn.toLowerCase().includes(searchLower) ||
          (c.nameAr != null && c.nameAr.toLowerCase().includes(searchLower)),
      )
      const individualMatch = (req.individuals ?? []).some((i) =>
        i.fullName.toLowerCase().includes(searchLower),
      )
      const matchSearch =
        !search ||
        requestIdStr.toLowerCase().includes(searchLower) ||
        companyMatch ||
        individualMatch
      const matchStatus = statusFilter === 'all' || req.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [requests, search, statusFilter])

  return (
    <div>
      <PageHeader
        title="My Requests"
        subtitle={`${filtered.length} request${filtered.length === 1 ? '' : 's'}`}
      />
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by request ID, company or individual"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v ?? 'all')}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={REQUEST_STATUS.UNDER_REVIEW}>
              Under review
            </SelectItem>
            <SelectItem value={REQUEST_STATUS.INVOICE_GENERATED}>
              Invoice generated
            </SelectItem>
            <SelectItem value={REQUEST_STATUS.PAID}>Paid</SelectItem>
            <SelectItem value={REQUEST_STATUS.PROCESSING}>
              Processing
            </SelectItem>
            <SelectItem value={REQUEST_STATUS.COMPLETED}>Completed</SelectItem>
            <SelectItem value={REQUEST_STATUS.REJECTED}>Rejected</SelectItem>
            <SelectItem value={REQUEST_STATUS.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="min-w-0">
        <CardContent className="min-w-0 pt-6">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {requests.length === 0
                ? 'You have no requests yet. Request a screening package from a company page.'
                : 'No requests match your filters.'}
            </div>
          ) : (
            <div className="w-full max-w-full min-w-0 overflow-x-auto -mx-4 sm:mx-0">
              <Table className="min-w-2xl">
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Companies & reports</TableHead>
                    <TableHead>Individuals & reports</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((req) => {
                    const companyWithReports = getCompanyWithReports(req)
                    const individualWithReports = getIndividualWithReports(req)
                    return (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono font-medium">
                          {formatRequestId(req.id)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {companyWithReports.length === 0 ? (
                              <span className="text-muted-foreground">—</span>
                            ) : (
                              companyWithReports.map(({ company, reports }) => (
                                <div
                                  key={company.id}
                                  className="flex flex-col gap-1"
                                >
                                  <span className="font-medium">
                                    {company.nameAr
                                      ? `${company.nameEn} (${company.nameAr})`
                                      : company.nameEn}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {reports.map((r) => (
                                      <Badge
                                        key={r.id}
                                        variant="secondary"
                                        className="text-[10px]"
                                      >
                                        {r.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {individualWithReports.length === 0 ? (
                              <span className="text-muted-foreground">—</span>
                            ) : (
                              individualWithReports.map(
                                ({ individual, reports }) => (
                                  <div
                                    key={individual.id}
                                    className="flex flex-col gap-1"
                                  >
                                    <span className="font-medium">
                                      {individual.fullName}
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {reports.map((r) => (
                                        <Badge
                                          key={r.id}
                                          variant="secondary"
                                          className="text-[10px]"
                                        >
                                          {r.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                ),
                              )
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusPill status={req.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(req.estimatedPrice, req.finalPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {req.status ===
                              REQUEST_STATUS.INVOICE_GENERATED && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-purple-600 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/50"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            {req.status === REQUEST_STATUS.COMPLETED && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-green-600 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50"
                              >
                                <Download size={16} />
                              </Button>
                            )}
                            <Link
                              to="/requests/$requestId"
                              params={{ requestId: String(req.id) }}
                            >
                              <Button variant="ghost" size="icon">
                                <Eye size={16} />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
