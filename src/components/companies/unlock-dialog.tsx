import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  Coins,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { getCompanyDetailFieldIcon } from './get-company-detail-field-icon'
import type { ReactNode } from 'react'
import type { TSensitiveField } from '@/types/company'
import type { UnlockRefusal } from '@/lib/unlock-refusal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { InlinePlanOptions } from '@/components/pricing/inline-plan-options'

import { getCreditBalanceQueryOptions } from '@/apis/credits/get-credit-balance'
import { useUnlockAllFields } from '@/apis/unlocks/unlock-all-fields'
import { useUnlockField } from '@/apis/unlocks/unlock-field'
import {
  balanceAfter,
  canAfford,
  formatCredits,
  shortfall as shortfallOf,
} from '@/lib/credits'
import { readUnlockRefusal } from '@/lib/unlock-refusal'
import { cn } from '@/lib/utils'

/** What the dialog unlocks: one locked field, or every remaining locked field at their summed cost. */
export type UnlockTarget =
  | { kind: 'field'; field: TSensitiveField }
  | { kind: 'all'; fields: Array<TSensitiveField>; total: number }

type UnlockDialogProps = {
  companyId: number
  /** null closes the dialog. */
  target: UnlockTarget | null
  onClose: () => void
}

/** Id of an unlocked field's tile, where focus lands after a successful Unlock. */
export const unlockedFieldElementId = (key: TSensitiveField['key']) =>
  `unlocked-field-${key}`

const targetKey = (target: UnlockTarget | null) =>
  target === null ? null : target.kind === 'all' ? 'all' : target.field.key

const targetCost = (target: UnlockTarget | null) =>
  target === null ? 0 : target.kind === 'all' ? target.total : target.field.cost

/**
 * Confirms spending Credits on one Sensitive field, or on all remaining ones in one go:
 * cost, balance now and balance after. Without enough Credits the confirm action is replaced
 * by the shortfall and inline Credit plan cards that buy and come back here. A cost that changed meanwhile is shown in
 * place to confirm again.
 */
export function UnlockDialog({
  companyId,
  target,
  onClose,
}: UnlockDialogProps) {
  // `shown` keeps the last target on screen while the dialog animates closed.
  const [shown, setShown] = useState(target)
  const [cost, setCost] = useState(targetCost(target))
  const [refusal, setRefusal] = useState<UnlockRefusal | null>(null)
  const [unlockedKey, setUnlockedKey] = useState<string | null>(null)
  const [openedKey, setOpenedKey] = useState<string | null>(null)

  // Each opening starts afresh at the displayed cost. A target refetched while the dialog is
  // open (e.g. after a refusal) keeps the dialog's state.
  const key = targetKey(target)
  if (key !== openedKey) {
    setOpenedKey(key)
    if (target) {
      setShown(target)
      setCost(targetCost(target))
      setRefusal(null)
      setUnlockedKey(null)
    }
  }

  const balanceQuery = useQuery({
    ...getCreditBalanceQueryOptions(),
    enabled: target !== null,
  })
  const unlockOne = useUnlockField()
  const unlockAll = useUnlockAllFields()
  const isPending = unlockOne.isPending || unlockAll.isPending

  const serverBalance =
    refusal?.kind === 'insufficient'
      ? refusal.balance
      : balanceQuery.data?.data.balance
  const short =
    refusal?.kind === 'insufficient'
      ? refusal.shortfall
      : serverBalance === undefined
        ? 0
        : shortfallOf(serverBalance, cost)
  const insufficient =
    refusal?.kind === 'insufficient' ||
    (serverBalance !== undefined && !canAfford(serverBalance, cost))

  if (!shown) return null
  const all = shown.kind === 'all'
  const Icon = all ? Sparkles : getCompanyDetailFieldIcon(shown.field.key)

  const onRefused = (error: unknown) => {
    const reason = readUnlockRefusal(error)
    if (reason.kind === 'costChanged') setCost(reason.current)
    setRefusal(reason)
  }

  const confirm = () => {
    setRefusal(null)
    if (shown.kind === 'field') {
      unlockOne.mutate(
        { companyId, fieldKey: shown.field.key, expectedCost: cost },
        {
          onSuccess: ({ data }) => {
            setUnlockedKey(data.field.key)
            toast.success(
              data.charged > 0
                ? `${data.field.label} unlocked for ${formatCredits(data.charged)}`
                : `${data.field.label} is already unlocked`,
            )
            onClose()
          },
          onError: onRefused,
        },
      )
      return
    }
    unlockAll.mutate(
      { companyId, expectedTotal: cost },
      {
        onSuccess: ({ data }) => {
          setUnlockedKey(data.fields[0]?.key ?? null)
          toast.success(
            data.charged > 0
              ? `${fieldCount(data.fields.length)} unlocked for ${formatCredits(data.charged)}`
              : 'Every field is already unlocked',
          )
          onClose()
        },
        onError: onRefused,
      },
    )
  }

  return (
    <AlertDialog
      open={target !== null}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          unlockOne.reset()
          unlockAll.reset()
          onClose()
        }
      }}
    >
      <AlertDialogContent
        className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto rounded-2xl p-5 data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-md"
        finalFocus={() =>
          (unlockedKey &&
            document.getElementById(
              unlockedFieldElementId(unlockedKey as TSensitiveField['key']),
            )) ||
          true
        }
      >
        <AlertDialogHeader className="place-items-start text-start">
          <div className="mb-1 flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15 ring-inset">
            <Icon className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <AlertDialogTitle className="text-lg font-semibold tracking-tight">
            {all
              ? `Unlock all ${shown.fields.length} remaining fields?`
              : `Unlock ${shown.field.label}?`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-start">
            {all
              ? 'One payment for every field still locked, at the sum of their Field costs with no discount. If any part fails, nothing is charged.'
              : 'The current value appears right away and the Unlock is yours for good. Opening it again is free.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <dl className="rounded-xl bg-muted/50 p-1 ring-1 ring-border/70 ring-inset">
          <div className="space-y-0 rounded-lg bg-card px-4 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-none">
            {all &&
              shown.fields.map((field) => (
                <SummaryRow key={field.key} label={field.label} muted>
                  {formatCredits(field.cost)}
                </SummaryRow>
              ))}
            <SummaryRow label={all ? 'Total' : 'Field cost'} emphasis={all}>
              <span className="inline-flex items-center gap-1.5">
                <Coins
                  className="size-3.5 text-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {formatCredits(cost)}
              </span>
            </SummaryRow>
            <SummaryRow label="Your balance">
              <BalanceValue
                value={serverBalance}
                loading={balanceQuery.isPending}
              />
            </SummaryRow>
            <SummaryRow label="Balance after" emphasis>
              {insufficient ? (
                <span className="text-muted-foreground">Not enough</span>
              ) : (
                <BalanceValue
                  value={
                    serverBalance === undefined
                      ? undefined
                      : balanceAfter(serverBalance, cost)
                  }
                  loading={balanceQuery.isPending}
                />
              )}
            </SummaryRow>
          </div>
        </dl>

        {refusal?.kind === 'costChanged' && (
          <InlineNotice>
            {all ? 'The total' : 'Price'} changed to{' '}
            {formatCredits(refusal.current)}. Confirm again to unlock at the new
            {all ? ' total' : ' cost'}.
          </InlineNotice>
        )}
        {refusal?.kind === 'other' && (
          <InlineNotice>{refusal.message}</InlineNotice>
        )}
        {balanceQuery.isError && !refusal && (
          <InlineNotice>
            We couldn&rsquo;t load your Credit balance. You can still try to
            unlock; nothing is charged if your balance is too low.
          </InlineNotice>
        )}

        {insufficient && (
          <div className="flex flex-col gap-3 rounded-xl bg-primary/6 p-4 ring-1 ring-primary/15 ring-inset dark:bg-primary/12">
            <div role="status" className="flex items-start gap-2.5">
              <Lock
                className="mt-0.5 size-4 shrink-0 text-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold tabular-nums">
                  You need {formatCredits(short)} more
                </p>
                <p className="text-xs text-muted-foreground">
                  Nothing was charged and{' '}
                  {all ? 'the fields stay locked' : 'the field stays locked'}.
                  Buy a Credit plan and you&rsquo;ll come straight back here
                  to unlock {all ? 'them' : 'it'}.
                </p>
              </div>
            </div>
            <InlinePlanOptions
              shortfall={short}
              returnTo={{ kind: 'company', companyId: String(companyId) }}
            />
          </div>
        )}

        <AlertDialogFooter className="-mx-5 -mb-5 rounded-b-2xl px-5">
          <AlertDialogCancel
            size="lg"
            className="min-h-11"
            disabled={isPending}
          >
            {insufficient ? 'Close' : 'Cancel'}
          </AlertDialogCancel>
          {insufficient ? null : (
            <AlertDialogAction
              size="lg"
              className="min-h-11 gap-2 tabular-nums active:scale-[0.98]"
              disabled={isPending}
              onClick={confirm}
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {isPending
                ? 'Unlocking'
                : `Unlock${all ? ' all' : ''} for ${formatCredits(cost)}`}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** "1 field", "3 fields". */
function fieldCount(count: number) {
  return `${count} ${count === 1 ? 'field' : 'fields'}`
}

function SummaryRow({
  label,
  emphasis = false,
  muted = false,
  children,
}: {
  label: string
  emphasis?: boolean
  muted?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-2.5 text-sm',
        muted && 'py-1.5 text-xs',
        emphasis && 'border-t border-dashed border-border',
      )}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          'tabular-nums',
          emphasis ? 'font-semibold text-foreground' : 'font-medium',
        )}
      >
        {children}
      </dd>
    </div>
  )
}

function BalanceValue({
  value,
  loading,
}: {
  value: number | undefined
  loading: boolean
}) {
  if (loading) {
    return (
      <>
        <span className="sr-only">Loading</span>
        <span
          className="inline-block h-3.5 w-20 animate-pulse rounded-full bg-muted align-middle"
          aria-hidden
        />
      </>
    )
  }
  if (value === undefined)
    return <span className="text-muted-foreground">Unknown</span>
  return <>{formatCredits(value)}</>
}

function InlineNotice({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-3 text-sm text-amber-900 ring-1 ring-amber-200 ring-inset dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/20"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}
