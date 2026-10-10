import { createFileRoute } from '@tanstack/react-router'
import { Coins, History } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/page-header'
import { FullPageLoading } from '@/components/ui/full-page-loading'

import {
  getCreditBalanceQueryOptions,
  useGetCreditBalance,
} from '@/apis/credits/get-credit-balance'
import { formatCredits } from '@/lib/credits'

// Placeholder until the full Credits page (Credit history, Plan purchases) lands.
export const Route = createFileRoute('/_protected/credits/')({
  pendingComponent: FullPageLoading,
  component: CreditsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getCreditBalanceQueryOptions())
    return {}
  },
})

function CreditsPage() {
  const { data } = useGetCreditBalance()
  const balance = data.data.balance

  return (
    <div className="space-y-8">
      <PageHeader
        title="Credits"
        subtitle="Spend Credits to Unlock Sensitive fields of any company."
      />

      <section className="rounded-2xl bg-primary/5 p-1.5 ring-1 ring-primary/10">
        <div className="flex flex-col gap-4 rounded-[calc(1rem-0.375rem)] bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Credit balance
            </p>
            <p className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
              {formatCredits(balance)}
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Coins className="size-6" strokeWidth={1.5} aria-hidden />
          </div>
        </div>
      </section>

      <EmptyState
        icon={History}
        title="Your Credit history will appear here"
        description="Every Credit added or spent will be listed with the balance after it."
      />
    </div>
  )
}
