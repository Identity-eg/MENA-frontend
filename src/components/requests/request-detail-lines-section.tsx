import { Building2 } from 'lucide-react'
import { memo } from 'react'

import { EmptyState } from '@/components/EmptyState'

import { REQUEST_REPORT_STATUS } from '@/types/request'
import type { RequestDetailCompanyGroup } from './build-request-detail-groups'
import { CompanyName } from './company-name'
import { RequestDetailLineRow } from './request-detail-line-row'

type RequestDetailLinesSectionProps = {
  groups: Array<RequestDetailCompanyGroup>
  inProgress: boolean
}

function summarize(groups: Array<RequestDetailCompanyGroup>) {
  const lines = groups.flatMap((g) => g.lines)
  const live = lines.filter((l) => !l.rejected)
  const delivered = live.filter(
    (l) => l.status === REQUEST_REPORT_STATUS.DELIVERED,
  ).length
  const refunds = lines.filter((l) => l.refundDue).length
  const parts = [
    `${lines.length} report${lines.length === 1 ? '' : 's'}`,
    `${groups.length} compan${groups.length === 1 ? 'y' : 'ies'}`,
  ]
  if (delivered > 0) parts.push(`${delivered} of ${live.length} delivered`)
  if (refunds > 0)
    parts.push(`${refunds} refund${refunds === 1 ? '' : 's'} due`)
  return parts.join(' · ')
}

export const RequestDetailLinesSection = memo(
  function RequestDetailLinesSection({
    groups,
    inProgress,
  }: RequestDetailLinesSectionProps) {
    return (
      <section
        id="request-reports"
        aria-labelledby="request-reports-heading"
        className="scroll-mt-6 rounded-xl border bg-card"
      >
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-4 py-4 sm:px-6">
          <h2
            id="request-reports-heading"
            className="text-base font-semibold tracking-tight"
          >
            Reports
          </h2>
          {groups.length > 0 && (
            <p className="text-sm text-muted-foreground tabular-nums">
              {summarize(groups)}
            </p>
          )}
        </header>

        {groups.length === 0 ? (
          <div className="p-4 sm:p-6">
            <EmptyState
              icon={Building2}
              title="No reports in this request"
              description="Reports you order for a company will appear here."
            />
          </div>
        ) : (
          <div className="divide-y">
            {groups.map((group) => (
              <div
                key={group.company.id}
                className="grid gap-x-8 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
              >
                <div className="flex min-w-0 items-start gap-3 pb-1 lg:pt-3.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Building2 aria-hidden className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <CompanyName company={group.company} className="text-sm" />
                    {group.country && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {group.country}
                      </p>
                    )}
                  </div>
                </div>
                <ul className="divide-y divide-border/70">
                  {group.lines.map((line) => (
                    <RequestDetailLineRow
                      key={line.id}
                      line={line}
                      inProgress={inProgress}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    )
  },
)
