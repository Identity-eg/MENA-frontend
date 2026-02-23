import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { useGetRequests } from '@/apis/requests/get-requests'
import type { TRequest } from '@/types/request'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/StatusPill'

const RECENT_LIMIT = 5

/** Derive company names from requestReports when companies not present */
function getCompanyNames(req: TRequest): string[] {
  if (req.companies?.length) {
    return req.companies.map((c) =>
      c.nameAr ? `${c.nameEn} (${c.nameAr})` : c.nameEn,
    )
  }
  const seen = new Set<number>()
  return (req.requestReports ?? [])
    .filter((rr) => rr.companyId != null && rr.company != null)
    .map((rr) => rr.company!)
    .filter((c) => {
      if (seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })
    .map((c) => (c.nameAr ? `${c.nameEn} (${c.nameAr})` : c.nameEn))
}

/** Derive individual count from requestReports when individuals not present */
function getIndividualCount(req: TRequest): number {
  if (req.individuals?.length !== undefined) return req.individuals.length
  const seen = new Set<number>()
  return (req.requestReports ?? [])
    .filter((rr) => rr.individualId != null && rr.individual != null)
    .filter((rr) => {
      if (seen.has(rr.individualId!)) return false
      seen.add(rr.individualId!)
      return true
    }).length
}

function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

function formatPrice(estimatedPrice: number, invoiceAmount?: number | null) {
  const amount = invoiceAmount ?? estimatedPrice
  return `$${amount}`
}

export function DashboardRecentRequests() {
  const { data } = useGetRequests()
  const allRequests: Array<TRequest> = data?.data ?? []
  const recentRequests = allRequests.slice(0, RECENT_LIMIT)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your most recently submitted compliance checks
          </p>
        </div>
        <Link to="/requests">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentRequests.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No requests yet. Create one from the requests page.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-medium">
                    {formatRequestId(req.id)}
                  </TableCell>
                  <TableCell>
                    {getCompanyNames(req).join(', ') || '—'}
                    {getIndividualCount(req) > 0 &&
                      ` · ${getIndividualCount(req)} individual${getIndividualCount(req) !== 1 ? 's' : ''}`}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={req.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(req.totalEstimatedPrice, req.invoice?.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/requests/$requestId"
                      params={{ requestId: String(req.id) }}
                    >
                      <Button variant="ghost" size="icon">
                        <Eye size={16} />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
