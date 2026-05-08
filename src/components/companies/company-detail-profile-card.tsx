import { memo, ReactNode } from 'react'
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
  children?: ReactNode
}

const REGISTRATION_KEYS = ['registrationNumber', 'UNN', 'centralNumber', 'civilId', 'legalForm', 'classification', 'estDate', 'expiryDate', 'status', 'entityNumber', 'TaxRegNumber', 'unifiedEconomicNumber', 'bcciIssueDate', 'bcciExpiryDate', 'businessNameAr', 'businessNameEn', 'licenseCategory', 'licenseNumber', 'mainLicenseNumber', 'dcciNumber', 'D_B_dunsNumber', 'licenseTarget', 'lastBudgetStatus', 'country']
const ACTIVITIES_KEYS = ['activityCode', 'activityName', 'activityStatus', 'activity_ISICCode', 'sectorDescription']
const CAPITAL_KEYS = ['totalShares', 'shareValue', 'currency', 'paid', 'totalCapital', 'cashCapital', 'assetCapital', 'nominated', 'auth', 'capital']
const AMENDMENTS_KEYS = ['amendDate', 'amendType', 'amendDescription']

function Section({ title, fields }: { title: string, fields: CompanyProfileFieldRow[] }) {
  if (fields.length === 0) return null
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
        {title}
      </h3>
      <div className="space-y-1">
        {fields.map(({ key, label, value }) => (
          <div
            key={key}
            className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              {label}
            </span>
            <p className="text-sm text-foreground wrap-break-word">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const CompanyDetailProfileCard = memo(function CompanyDetailProfileCard({
  publicFields,
  children,
}: CompanyDetailProfileCardProps) {
  const fieldsWithValue = publicFields.filter(f => f.value !== null && f.value !== undefined && f.value !== '')

  const registrationData = fieldsWithValue.filter(f => REGISTRATION_KEYS.includes(f.key))
  const activitiesData = fieldsWithValue.filter(f => ACTIVITIES_KEYS.includes(f.key))
  const capitalData = fieldsWithValue.filter(f => CAPITAL_KEYS.includes(f.key))
  const amendmentsData = fieldsWithValue.filter(f => AMENDMENTS_KEYS.includes(f.key))

  const hasAnyFields = fieldsWithValue.length > 0 || children

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
        {hasAnyFields ? (
          <div className="space-y-6">
            <Section title="Registration data" fields={registrationData} />
            {children}
            <Section title="Activities" fields={activitiesData} />
            <Section title="Capital details" fields={capitalData} />
            <Section title="Amendments" fields={amendmentsData} />
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No public profile data"
            description="There are no public details available for this company yet."
          />
        )}
      </CardContent>
    </Card>
  )
})
