import { memo } from 'react'
import {
  ChevronRight,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TLockedField } from '@/types/locked-field'
import type { CompanyProfileFieldRow } from './company-detail-types'
import { getCompanyDetailFieldIcon } from './get-company-detail-field-icon'

type CompanyDetailPremiumLockedCardProps = {
  lockedFields: CompanyProfileFieldRow[]
  totalUnlockPrice: number
  getLockedField: (fieldName: string) => TLockedField | undefined
  unlockingFieldId: number | null
  unlockingAll: boolean
  onUnlockField: (lockedFieldId: number) => void
  onUnlockAll: () => void
}

export const CompanyDetailPremiumLockedCard = memo(
  function CompanyDetailPremiumLockedCard({
    lockedFields,
    totalUnlockPrice,
    getLockedField,
    unlockingFieldId,
    unlockingAll,
    onUnlockField,
    onUnlockAll,
  }: CompanyDetailPremiumLockedCardProps) {
    if (lockedFields.length === 0) return null

    return (
      <Card className="relative overflow-hidden rounded-2xl border-0 bg-linear-to-b from-primary/8 via-primary/5 to-transparent shadow-lg ring-1 ring-primary/10 dark:from-primary/15 dark:via-primary/10 dark:to-transparent dark:ring-primary/20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
        <CardHeader className="relative pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-inner dark:bg-primary/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Premium details
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="shrink-0 border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider dark:bg-primary/20"
                  >
                    Pro
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  Unlock verified contact and location data for due diligence
                  and compliance.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lockedFields.map(({ key, label, value }) => {
              const locked = getLockedField(key)
              if (!locked) return null
              const FieldIcon = getCompanyDetailFieldIcon(key)
              return (
                <div
                  key={key}
                  className={cn(
                    'group flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-4 backdrop-blur-sm transition-all duration-200',
                    'hover:border-primary/25 hover:bg-card dark:bg-card/60 dark:hover:bg-card/80',
                    lockedFields.length === 1 && 'sm:col-span-2',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <FieldIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                        <div className="min-h-6 select-none text-sm font-medium blur-xs transition-all group-hover:blur-sm">
                          {value}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className={cn(
                        'shrink-0 transition-all duration-200',
                        'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow',
                      )}
                      disabled={unlockingFieldId === locked.id || unlockingAll}
                      onClick={() => onUnlockField(locked.id)}
                    >
                      {unlockingFieldId === locked.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      Unlock · ${locked.price.toFixed(2)}
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Reveal after purchase</span>
                  </div>
                </div>
              )
            })}
          </div>
          {lockedFields.length > 1 && totalUnlockPrice > 0 && (
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    Unlock all {lockedFields.length} fields
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get full access in one click
                  </p>
                </div>
                <Button
                  size="default"
                  disabled={
                    unlockingFieldId != null ||
                    unlockingAll ||
                    lockedFields.length === 0
                  }
                  onClick={onUnlockAll}
                >
                  {unlockingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="ml-1 h-4 w-4" />
                  )}{' '}
                  Unlock all · ${totalUnlockPrice.toFixed(2)}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  },
)
