import { useQuery } from '@tanstack/react-query'
import {
  Ban,
  ChevronRight,
  CircleCheck,
  CircleMinus,
  Coins,
  Lock,
  Sparkles,
} from 'lucide-react'
import { memo } from 'react'

import { getCompanyDetailFieldIcon } from './get-company-detail-field-icon'
import type { TSensitiveField, TUnlockAllOffer } from '@/types/company'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getCreditBalanceQueryOptions } from '@/apis/credits/get-credit-balance'
import { canAfford, formatCredits, shortfall } from '@/lib/credits'
import { cn } from '@/lib/utils'

type CompanyDetailPremiumLockedCardProps = {
  lockedFields: Array<TSensitiveField>
  unavailableFields: Array<TSensitiveField>
  /** The server's "Unlock all" offer; null hides it. */
  unlockAll: TUnlockAllOffer | null
  onUnlockField: (field: TSensitiveField) => void
  onUnlockAll: () => void
}

/**
 * Whether the Credit balance covers a cost, as an icon and words (never colour alone). Only a
 * hint: the server still checks the balance when the Unlock is made. Just "Locked" until the
 * balance is known.
 */
function Coverage({
  balance,
  cost,
}: {
  balance: number | undefined
  cost: number
}) {
  if (balance === undefined) {
    return (
      <>
        <Lock className="h-3.5 w-3.5" aria-hidden />
        <span>Locked</span>
      </>
    )
  }
  if (canAfford(balance, cost)) {
    return (
      <>
        <CircleCheck
          className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
        <span>Locked · your balance covers it</span>
      </>
    )
  }
  return (
    <>
      <CircleMinus
        className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
        aria-hidden
      />
      <span className="tabular-nums">
        Locked · {formatCredits(shortfall(balance, cost))} short
      </span>
    </>
  )
}

/**
 * Sensitive fields the viewer can't see yet: locked ones with their Field cost in Credits,
 * and ones that can't be unlocked at the moment. Labels and costs come from the server.
 * Unlock and "Unlock all" open the confirmation dialog.
 */
export const CompanyDetailPremiumLockedCard = memo(
  function CompanyDetailPremiumLockedCard({
    lockedFields,
    unavailableFields,
    unlockAll,
    onUnlockField,
    onUnlockAll,
  }: CompanyDetailPremiumLockedCardProps) {
    const balanceQuery = useQuery(getCreditBalanceQueryOptions())
    const balance = balanceQuery.data?.data.balance
    const fields = [...lockedFields, ...unavailableFields]
    if (fields.length === 0) return null

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
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-inner dark:bg-primary/25">
              <Sparkles className="h-5 w-5" aria-hidden />
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
                  Credits
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Unlock registration and ownership data with Credits. Each field
                costs the same for every company, and an Unlock is yours for
                good.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((field) => {
              const FieldIcon = getCompanyDetailFieldIcon(field.key)
              const unavailable = field.state === 'unavailable'
              return (
                <li
                  key={field.key}
                  className={cn(
                    'group flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-4 backdrop-blur-sm transition-colors duration-200',
                    'dark:bg-card/60',
                    !unavailable &&
                      'hover:border-primary/25 hover:bg-card dark:hover:bg-card/80',
                    fields.length === 1 && 'sm:col-span-2',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <FieldIcon className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {field.label}
                        </span>
                        {unavailable ? (
                          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Ban className="h-3.5 w-3.5" aria-hidden />
                            Not available
                          </p>
                        ) : (
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground tabular-nums">
                            <Coins
                              className="h-3.5 w-3.5 text-primary"
                              aria-hidden
                            />
                            {formatCredits(field.cost)}
                          </p>
                        )}
                      </div>
                    </div>
                    {!unavailable && (
                      <Button
                        size="lg"
                        className="min-h-11 shrink-0 tabular-nums active:scale-[0.98]"
                        onClick={() => onUnlockField(field)}
                      >
                        Unlock
                        <span className="sr-only"> {field.label}</span> ·{' '}
                        {formatCredits(field.cost)}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {unavailable ? (
                      <span>This field can&rsquo;t be unlocked right now</span>
                    ) : (
                      <Coverage balance={balance} cost={field.cost} />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          {unlockAll && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
              <div>
                <p className="text-sm font-semibold">
                  Unlock all remaining fields
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {unlockAll.fieldKeys.length} fields,{' '}
                  {formatCredits(unlockAll.total)} in total, no discount
                </p>
              </div>
              <Button
                size="lg"
                className="min-h-11 tabular-nums active:scale-[0.98]"
                onClick={onUnlockAll}
              >
                Unlock all
                <span className="sr-only">
                  {' '}
                  {unlockAll.fieldKeys.length} remaining fields
                </span>{' '}
                · {formatCredits(unlockAll.total)}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  },
)
