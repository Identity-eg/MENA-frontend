import { memo, useMemo } from 'react'
import { CheckCircle2, FileSearch } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/EmptyState'
import { RequestScreeningPackageButton } from '@/components/request-screening-package-button'
import { cn } from '@/lib/utils'
import type { TReport } from '@/types/report'

type CompanyDetailComplianceCardProps = {
  companyId: number
  reports: TReport[]
  selectedReports: number[]
  onToggleReport: (reportId: number) => void
}

export const CompanyDetailComplianceCard = memo(
  function CompanyDetailComplianceCard({
    companyId,
    reports,
    selectedReports,
    onToggleReport,
  }: CompanyDetailComplianceCardProps) {
    const totalPrice = useMemo(
      () =>
        reports
          .filter((r) => selectedReports.includes(r.id))
          .reduce((acc, r) => acc + r.estimatedPrice, 0),
      [reports, selectedReports],
    )

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSearch className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">
                Compliance Reports
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Request screening packages for due diligence
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="No reports available"
              description="There are no compliance reports available for this company at the moment."
            />
          ) : (
            <div className="grid gap-3">
              {reports.map((report) => {
                const isSelected = selectedReports.includes(report.id)
                return (
                  <button
                    key={report.id}
                    type="button"
                        onClick={() => onToggleReport(report.id)}
                    className={cn(
                      'group relative flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20 dark:bg-primary/10'
                        : 'border-border hover:border-primary/40 hover:bg-muted/50',
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <div
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30 group-hover:border-primary/50',
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm">{report.name}</h4>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {report.description}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-2 text-[10px] font-medium"
                        >
                          TAT: {report.turnaround}
                        </Badge>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-bold text-primary">
                        ${report.estimatedPrice}
                      </span>
                      <p className="text-[10px] text-muted-foreground">Est.</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t bg-accent/20 pt-6">
          <div className="flex w-full items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase text-muted-foreground">
                Selection Summary
              </div>
              <div className="text-sm font-medium mt-1">
                {selectedReports.length} reports selected
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase text-muted-foreground">
                Total Estimate
              </div>
              <div className="text-xl font-bold text-primary">${totalPrice}</div>
            </div>
          </div>
          <RequestScreeningPackageButton
            companyId={companyId}
            selectedReportIds={selectedReports}
            disabled={selectedReports.length === 0}
          />
        </CardFooter>
      </Card>
    )
  },
)
