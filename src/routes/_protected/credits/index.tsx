import { createFileRoute } from '@tanstack/react-router'

import type {CreditHistorySearch} from '@/lib/credit-history';
import { CreditBalanceSummary } from '@/components/credits/credit-balance-summary'
import { PlanPurchasesSection } from '@/components/credits/plan-purchases-section'
import {
  CREDIT_HISTORY_PAGE_SIZE,
  CreditHistorySection,
} from '@/components/credits/credit-history-section'
import { PageHeader } from '@/components/page-header'
import { FullPageLoading } from '@/components/ui/full-page-loading'

import {
  getCreditBalanceQueryOptions,
  useGetCreditBalance,
} from '@/apis/credits/get-credit-balance'
import { getCreditTransactionsQueryOptions } from '@/apis/credits/get-credit-transactions'
import {
  
  creditHistoryParams,
  parseCreditHistorySearch
} from '@/lib/credit-history'

export const Route = createFileRoute('/_protected/credits/')({
  validateSearch: (search: Record<string, unknown>): CreditHistorySearch =>
    parseCreditHistorySearch(search),
  loaderDeps: ({ search }) => search,
  pendingComponent: FullPageLoading,
  component: CreditsPage,
  loader: async ({ context, deps }) => {
    // The history is prefetched, not awaited-or-throw: its errors show in place on the page.
    void context.queryClient.prefetchQuery(
      getCreditTransactionsQueryOptions(
        creditHistoryParams(deps, CREDIT_HISTORY_PAGE_SIZE),
      ),
    )
    await context.queryClient.ensureQueryData(getCreditBalanceQueryOptions())
    return {}
  },
})

function CreditsPage() {
  const { data } = useGetCreditBalance()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Credits"
        subtitle="Spend Credits to Unlock Sensitive fields of any company."
      />

      <CreditBalanceSummary balance={data.data.balance} />

      <CreditHistorySection
        search={search}
        onSearchChange={(next) => navigate({ search: next, replace: true })}
      />

      <PlanPurchasesSection />
    </div>
  )
}
