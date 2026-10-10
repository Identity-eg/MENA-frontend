import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ArrowUpRight, Coins, Loader2, Lock } from 'lucide-react'
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
import { buttonVariants } from '@/components/ui/button'

import { getCreditBalanceQueryOptions } from '@/apis/credits/get-credit-balance'
import { useUnlockField } from '@/apis/unlocks/unlock-field'
import {
  balanceAfter,
  canAfford,
  formatCredits,
  shortfall as shortfallOf,
} from '@/lib/credits'
import { readUnlockRefusal } from '@/lib/unlock-refusal'
import { cn } from '@/lib/utils'

type UnlockFieldDialogProps = {
  companyId: number
  /** The locked field being unlocked; null closes the dialog. */
  field: TSensitiveField | null
  onClose: () => void
}

/** Id of an unlocked field's tile, where focus lands after a successful Unlock. */
export const unlockedFieldElementId = (key: TSensitiveField['key']) =>
  `unlocked-field-${key}`

/**
 * Confirms spending Credits on one Sensitive field: cost, balance now and balance after.
 * Without enough Credits the confirm action is replaced by the shortfall and a link to the
 * Credit plans. A Field cost that changed meanwhile is shown in place to confirm again.
 */
export function UnlockFieldDialog({
  companyId,
  field,
  onClose,
}: UnlockFieldDialogProps) {
  // `shown` keeps the last field on screen while the dialog animates closed.
  const [shown, setShown] = useState(field)
  const [cost, setCost] = useState(field?.cost ?? 0)
  const [refusal, setRefusal] = useState<UnlockRefusal | null>(null)
  const [unlockedKey, setUnlockedKey] = useState<string | null>(null)
  const [openedKey, setOpenedKey] = useState<string | null>(null)

  // Each opening starts afresh at the displayed Field cost. A field refetched while the dialog
  // is open (e.g. after a refusal) keeps the dialog's state.
  const fieldKey = field?.key ?? null
  if (fieldKey !== openedKey) {
    setOpenedKey(fieldKey)
    if (field) {
      setShown(field)
      setCost(field.cost)
      setRefusal(null)
      setUnlockedKey(null)
    }
  }

  const balanceQuery = useQuery({
    ...getCreditBalanceQueryOptions(),
    enabled: field !== null,
  })
  const { mutate, isPending, reset } = useUnlockField()

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
  const FieldIcon = getCompanyDetailFieldIcon(shown.key)

  const confirm = () => {
    setRefusal(null)
    mutate(
      { companyId, fieldKey: shown.key, expectedCost: cost },
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
        onError: (error) => {
          const reason = readUnlockRefusal(error)
          if (reason.kind === 'costChanged') setCost(reason.currentCost)
          setRefusal(reason)
        },
      },
    )
  }

  return (
    <AlertDialog
      open={field !== null}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          reset()
          onClose()
        }
      }}
    >
      <AlertDialogContent
        className="gap-5 rounded-2xl p-5 data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-md"
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
            <FieldIcon className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <AlertDialogTitle className="text-lg font-semibold tracking-tight">
            Unlock {shown.label}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-start">
            The current value appears right away and the Unlock is yours for
            good. Opening it again is free.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <dl className="rounded-xl bg-muted/50 p-1 ring-1 ring-border/70 ring-inset">
          <div className="space-y-0 rounded-lg bg-card px-4 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-none">
            <SummaryRow label="Field cost">
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
            Price changed to {formatCredits(refusal.currentCost)}. Confirm again
            to unlock at the new cost.
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
          <div
            role="status"
            className="flex flex-col gap-3 rounded-xl bg-primary/6 p-4 ring-1 ring-primary/15 ring-inset dark:bg-primary/12"
          >
            <div className="flex items-start gap-2.5">
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
                  Nothing was charged and the field stays locked. Add Credits
                  with a Credit plan, then come back to unlock it.
                </p>
              </div>
            </div>
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
          {insufficient ? (
            <a
              href={`/pricing?returnTo=${encodeURIComponent(`/companies/${companyId}`)}`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group min-h-11 gap-2 active:scale-[0.98]',
              )}
            >
              See Credit plans
              <ArrowUpRight
                className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          ) : (
            <AlertDialogAction
              size="lg"
              className="min-h-11 gap-2 tabular-nums active:scale-[0.98]"
              disabled={isPending}
              onClick={confirm}
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {isPending ? 'Unlocking' : `Unlock for ${formatCredits(cost)}`}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SummaryRow({
  label,
  emphasis = false,
  children,
}: {
  label: string
  emphasis?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-2.5 text-sm',
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
