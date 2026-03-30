import { memo } from 'react'
import { CheckCircle2, Unlock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CompanyProfileFieldRow } from './company-detail-types'
import { getCompanyDetailFieldIcon } from './get-company-detail-field-icon'

type CompanyDetailUnlockedFieldsCardProps = {
  fields: CompanyProfileFieldRow[]
}

export const CompanyDetailUnlockedFieldsCard = memo(
  function CompanyDetailUnlockedFieldsCard({
    fields,
  }: CompanyDetailUnlockedFieldsCardProps) {
    if (fields.length === 0) return null

    return (
      <Card className="overflow-hidden rounded-2xl border-emerald-300/60 bg-linear-to-br from-emerald-100/80 to-transparent shadow-sm ring-1 ring-emerald-300 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-transparent dark:ring-emerald-800/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400">
              <Unlock className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                Unlocked details
              </CardTitle>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                Fields you’ve unlocked for this company
              </p>
            </div>
            <Badge className="ml-auto shrink-0 border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-bold uppercase">
              {fields.length} unlocked
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map(({ key, label, value }) => {
              const FieldIcon = getCompanyDetailFieldIcon(key)
              return (
                <div
                  key={key}
                  className={cn(
                    'group flex items-start gap-3 rounded-xl border border-emerald-500/50 bg-white/70 p-4 transition-colors dark:border-emerald-800/40 dark:bg-white/5',
                    'hover:border-emerald-300/60 hover:bg-white/90 dark:hover:border-emerald-700/50 dark:hover:bg-white/10',
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400">
                    <FieldIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700/90 dark:text-emerald-300/90">
                        {label}
                      </span>
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400"
                        aria-hidden
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {value ?? '—'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  },
)
