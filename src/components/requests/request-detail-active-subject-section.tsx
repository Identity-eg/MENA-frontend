import { memo } from 'react'
import { Building2, User } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmptyState } from '@/components/EmptyState'
import { RequestReportCard } from './request-report-card'
import type { RequestStatusValue } from '@/types/request'
import type { RequestDetailSubjectItem } from './request-detail-types'

type RequestDetailActiveSubjectSectionProps = {
  selectedSubject: RequestDetailSubjectItem | null
  subjectCount: number
  status: RequestStatusValue
}

export const RequestDetailActiveSubjectSection = memo(
  function RequestDetailActiveSubjectSection({
    selectedSubject,
    subjectCount,
    status,
  }: RequestDetailActiveSubjectSectionProps) {
    if (selectedSubject) {
      return (
        <Card className="overflow-hidden rounded-xl">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b bg-muted/5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {selectedSubject.type === 'Individual' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </span>
              <div>
                <CardTitle
                  className="text-xl font-semibold"
                  dir={
                    selectedSubject.type === 'Individual' ? 'rtl' : 'ltr'
                  }
                >
                  {selectedSubject.name}
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selectedSubject.type} · {selectedSubject.nationality}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
            <h3 className="mb-3 sm:mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Assigned Services & Reports
            </h3>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
              {selectedSubject.reports.map((report) => (
                <RequestReportCard
                  key={report.id}
                  report={report}
                  status={status}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={Building2}
            title={
              subjectCount === 0
                ? 'No subjects in this request'
                : 'Select a subject'
            }
            description={
              subjectCount === 0
                ? 'This request has no subjects yet.'
                : 'Choose a subject from the sidebar to view their reports.'
            }
          />
        </CardContent>
      </Card>
    )
  },
)
