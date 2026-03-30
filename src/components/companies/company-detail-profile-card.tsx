import { memo } from 'react'
import { Building2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmptyState } from '@/components/EmptyState'
import type { CompanyProfileFieldRow } from './company-detail-types'

type CompanyDetailProfileCardProps = {
  publicFields: CompanyProfileFieldRow[]
}

export const CompanyDetailProfileCard = memo(function CompanyDetailProfileCard({
  publicFields,
}: CompanyDetailProfileCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Company Profile
            </CardTitle>
            <p className="text-xs text-muted-foreground">Public information</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {publicFields.length > 0 ? (
          <div className="space-y-1">
            {publicFields.map(({ key, label, value }) => (
              <div
                key={key}
                className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {label}
                </span>
                <p className="text-sm text-foreground wrap-break-word">
                  {value ?? '—'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No public details"
            description="This company has no public profile information available."
          />
        )}
      </CardContent>
    </Card>
  )
})
