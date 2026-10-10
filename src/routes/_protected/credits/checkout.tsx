import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CircleCheck,
  CircleSlash,
  Clock,
  Coins,
  Loader2,
  
  TriangleAlert
} from 'lucide-react'
import {  useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type {LucideIcon} from 'lucide-react';
import type {ReactNode} from 'react';

import type { TPlanPurchase } from '@/types/credits'
import type {ReturnTarget} from '@/lib/plan-checkout';
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { getCreditBalanceQueryOptions } from '@/apis/credits/get-credit-balance'
import { useGetPlanPurchase } from '@/apis/credits/get-plan-purchase'
import { formatPlanPrice } from '@/lib/credit-plans'
import { formatCredits } from '@/lib/credits'
import {
  CHECKOUT_POLL_INTERVAL_MS,
  CHECKOUT_TIMEOUT_MS,
  
  checkoutReturnState,
  parseReturnTo,
  returnToPath
} from '@/lib/plan-checkout'
import { cn } from '@/lib/utils'

type CheckoutReturnSearch = {
  /** The Plan purchase Stripe returned from. */
  purchase?: number
  /** Present when the user cancelled at Stripe. */
  cancelled?: boolean
  /** Where to go once the Credits are added. */
  returnTo?: string
}

export const Route = createFileRoute('/_protected/credits/checkout')({
  validateSearch: (search: Record<string, unknown>): CheckoutReturnSearch => {
    const purchase = Number(search.purchase)
    const returnTo = parseReturnTo(search.returnTo)
    return {
      purchase:
        Number.isSafeInteger(purchase) && purchase > 0 ? purchase : undefined,
      cancelled:
        search.cancelled === true || search.cancelled === 'true'
          ? true
          : undefined,
      returnTo: returnTo ? returnToPath(returnTo) : undefined,
    }
  },
  component: CheckoutReturnPage,
})

function CheckoutReturnPage() {
  const { purchase, cancelled, returnTo: returnToParam } = Route.useSearch()
  const returnTo = parseReturnTo(returnToParam)

  return (
    <div className="mx-auto w-full max-w-xl py-6 sm:py-12">
      {purchase === undefined ? (
        <StatusCard
          icon={TriangleAlert}
          tone="warning"
          title="We couldn't tell which purchase this is"
          body="Your Credits page lists every Credit plan you bought and its payment status."
          actions={<CreditsLink primary />}
        />
      ) : cancelled ? (
        <CancelledCard returnTo={returnTo} />
      ) : (
        <PaymentProgress purchaseId={purchase} returnTo={returnTo} />
      )}
    </div>
  )
}

function CancelledCard({ returnTo }: { returnTo: ReturnTarget | null }) {
  return (
    <StatusCard
      icon={CircleSlash}
      tone="neutral"
      title="Payment cancelled"
      body="Nothing was charged and no Credits were added. You can pick a plan again whenever you're ready."
      actions={
        <>
          <PlansLink returnTo={returnTo} primary label="Back to plans" />
          {returnTo?.kind === 'company' && <CompanyLink target={returnTo} />}
        </>
      }
    />
  )
}

/**
 * Polls the Plan purchase until Stripe's webhook decides it. On PAID the Credits are already in
 * the balance: refresh everything Credit-related, then go back where checkout started.
 */
function PaymentProgress({
  purchaseId,
  returnTo,
}: {
  purchaseId: number
  returnTo: ReturnTarget | null
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [timedOut, setTimedOut] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setTimedOut(false)
    const timer = window.setTimeout(
      () => setTimedOut(true),
      CHECKOUT_TIMEOUT_MS,
    )
    return () => window.clearTimeout(timer)
  }, [attempt])

  const query = useGetPlanPurchase(purchaseId, {
    poll: !timedOut,
    pollMs: CHECKOUT_POLL_INTERVAL_MS,
  })
  const purchase = query.data?.data
  const state = purchase
    ? checkoutReturnState(purchase.status, timedOut ? CHECKOUT_TIMEOUT_MS : 0)
    : null

  // Stop polling as soon as the purchase is decided.
  const settled =
    state !== null && state !== 'processing' && state !== 'timedOut'
  useEffect(() => {
    if (settled) setTimedOut(true)
  }, [settled])

  const announced = useRef(false)
  useEffect(() => {
    if (state !== 'paid' || !purchase || announced.current) return
    announced.current = true
    void queryClient.invalidateQueries({ queryKey: ['credits'] })
    toast.success(
      purchase.grant
        ? `${formatCredits(purchase.credits)} added. Your balance is now ${formatCredits(purchase.grant.balanceAfter)}.`
        : `${formatCredits(purchase.credits)} added.`,
    )
    if (returnTo?.kind === 'company') {
      void navigate({
        to: '/companies/$companyId',
        params: { companyId: returnTo.companyId },
        replace: true,
      })
    }
  }, [state, purchase, queryClient, navigate, returnTo])

  if (query.isError) {
    return (
      <StatusCard
        icon={TriangleAlert}
        tone="warning"
        title="We couldn't load this purchase"
        body={
          query.error.status === 404
            ? "This purchase isn't on your account. Your Credits page lists the Credit plans you bought."
            : 'Check your connection and try again. If you paid, your Credits are added as soon as Stripe confirms the payment.'
        }
        actions={
          <>
            {query.error.status !== 404 && (
              <button
                type="button"
                onClick={() => void query.refetch()}
                className={cn(buttonVariants({ size: 'lg' }), 'min-h-11')}
              >
                Try again
              </button>
            )}
            <CreditsLink primary={query.error.status === 404} />
          </>
        }
      />
    )
  }

  if (!purchase || state === 'processing') {
    return (
      <StatusCard
        icon={Loader2}
        spin
        tone="pending"
        title="Confirming your payment"
        body="Stripe is confirming your payment. This usually takes a few seconds; please keep this page open."
        details={
          purchase ? (
            <PurchaseSummary purchase={purchase} />
          ) : (
            <SummarySkeleton />
          )
        }
      />
    )
  }

  if (state === 'timedOut') {
    return (
      <StatusCard
        icon={Clock}
        tone="pending"
        title="Still waiting for confirmation"
        body="Stripe hasn't confirmed this payment yet. If it goes through, your Credits are added automatically and show on your Credits page. You'll also get an email."
        details={<PurchaseSummary purchase={purchase} />}
        actions={
          <>
            <CreditsLink primary />
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'min-h-11',
              )}
            >
              Check again
            </button>
          </>
        }
      />
    )
  }

  if (state === 'failed' || state === 'expired') {
    return (
      <StatusCard
        icon={CircleSlash}
        tone="warning"
        title={state === 'failed' ? 'Payment failed' : 'Checkout expired'}
        body={
          state === 'failed'
            ? 'Your bank or card declined the payment, so no Credits were added. You can try again with another payment method.'
            : 'The checkout closed before the payment was completed, so nothing was charged and no Credits were added.'
        }
        details={<PurchaseSummary purchase={purchase} />}
        actions={
          <>
            <PlansLink returnTo={returnTo} primary label="Try again" />
            <CreditsLink />
          </>
        }
      />
    )
  }

  return <PaidCard purchase={purchase} returnTo={returnTo} />
}

function PaidCard({
  purchase,
  returnTo,
}: {
  purchase: TPlanPurchase
  returnTo: ReturnTarget | null
}) {
  const balance = useQuery(getCreditBalanceQueryOptions())
  const newBalance = balance.data?.data.balance ?? purchase.grant?.balanceAfter

  return (
    <StatusCard
      icon={CircleCheck}
      tone="success"
      title={`${formatCredits(purchase.credits)} added`}
      body="We've emailed you a confirmation, and Stripe sends your payment receipt."
      details={
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border/70 ring-1 ring-border/70">
          <div className="bg-card px-4 py-3">
            <dt className="text-xs text-muted-foreground">Credit plan</dt>
            <dd className="mt-0.5 text-sm font-semibold text-foreground">
              {purchase.planName}
            </dd>
          </div>
          <div className="bg-card px-4 py-3">
            <dt className="text-xs text-muted-foreground">New balance</dt>
            <dd className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground tabular-nums">
              <Coins
                className="size-3.5 text-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              {newBalance === undefined ? '...' : formatCredits(newBalance)}
            </dd>
          </div>
        </dl>
      }
      actions={
        returnTo?.kind === 'company' ? (
          <CompanyLink target={returnTo} primary />
        ) : (
          <>
            <CreditsLink primary />
            <Link
              to="/companies"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'min-h-11',
              )}
            >
              Find a company
            </Link>
          </>
        )
      }
    />
  )
}

const TONES = {
  pending: 'bg-primary/10 text-primary ring-primary/15',
  success:
    'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
  warning:
    'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300',
  neutral: 'bg-muted text-muted-foreground ring-border',
} as const

/** One state of the checkout return: an icon, what happened, the purchase, and what to do next. */
function StatusCard({
  icon: Icon,
  spin = false,
  tone,
  title,
  body,
  details,
  actions,
}: {
  icon: LucideIcon
  spin?: boolean
  tone: keyof typeof TONES
  title: string
  body: string
  details?: ReactNode
  actions?: ReactNode
}) {
  return (
    <section
      aria-labelledby="checkout-status-title"
      className="rounded-[1.25rem] bg-muted/50 p-1.5 ring-1 ring-border/70 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
    >
      <div className="space-y-6 rounded-[calc(1.25rem-0.375rem)] bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:p-8 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div aria-live="polite" className="space-y-4">
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-full ring-1 ring-inset',
              TONES[tone],
            )}
          >
            <Icon
              className={cn(
                'size-6',
                spin && 'animate-spin motion-reduce:animate-none',
              )}
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <div className="space-y-1.5">
            <h1
              id="checkout-status-title"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              {title}
            </h1>
            <p className="max-w-[55ch] text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>
          </div>
        </div>
        {details}
        {actions && (
          <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
        )}
      </div>
    </section>
  )
}

function PurchaseSummary({ purchase }: { purchase: TPlanPurchase }) {
  return (
    <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl bg-muted/40 px-4 py-3 text-sm ring-1 ring-border/60">
      <span className="font-medium text-foreground">
        {purchase.planName} Credit plan
      </span>
      <span className="text-muted-foreground tabular-nums">
        {formatCredits(purchase.credits)} for{' '}
        {formatPlanPrice(purchase.priceCents)}
      </span>
    </p>
  )
}

function SummarySkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3 ring-1 ring-border/60">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-28" />
    </div>
  )
}

const linkClass = (primary: boolean) =>
  cn(
    buttonVariants({ variant: primary ? 'default' : 'outline', size: 'lg' }),
    'min-h-11 active:scale-[0.98]',
  )

function CreditsLink({ primary = false }: { primary?: boolean }) {
  return (
    <Link to="/credits" className={linkClass(primary)}>
      Go to your Credits
    </Link>
  )
}

function PlansLink({
  returnTo,
  primary = false,
  label,
}: {
  returnTo: ReturnTarget | null
  primary?: boolean
  label: string
}) {
  return (
    <Link
      to="/pricing"
      search={returnTo ? { returnTo: returnToPath(returnTo) } : {}}
      className={linkClass(primary)}
    >
      {label}
    </Link>
  )
}

function CompanyLink({
  target,
  primary = false,
}: {
  target: Extract<ReturnTarget, { kind: 'company' }>
  primary?: boolean
}) {
  return (
    <Link
      to="/companies/$companyId"
      params={{ companyId: target.companyId }}
      className={cn(linkClass(primary), 'gap-2')}
    >
      <ArrowLeft className="size-4" aria-hidden />
      Back to the company
    </Link>
  )
}
