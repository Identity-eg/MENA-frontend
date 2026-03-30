import { Suspense } from 'react'
import { ArrowLeft, Building2 } from 'lucide-react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  getCompanyQueryOptions,
} from '@/apis/company/get-company'
import { CompanyDetailLoadingFallback } from '@/components/companies/company-detail-loading-fallback'
import { CompanyDetailView } from '@/components/companies/company-detail-view'

export const Route = createFileRoute('/_protected/companies/$companyId')({
  component: CompanyDetailsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    unlock: search.unlock as string | undefined,
  }),
  loader: async ({ context, params }) => {
    const companyId = params.companyId

    try {
      await context.queryClient.ensureQueryData(
        getCompanyQueryOptions(Number(companyId)),
      )
    } catch {
      throw notFound()
    }
  },
  errorComponent() {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24">
        <div className="rounded-full bg-destructive/10 p-4">
          <Building2 className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            We couldn’t load this company. Please try again or return to the
            search.
          </p>
        </div>
        <Link to="/companies">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to companies
          </Button>
        </Link>
      </div>
    )
  },
  pendingComponent: CompanyDetailLoadingFallback,
  notFoundComponent() {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24">
        <div className="rounded-full bg-muted p-4">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold">Company not found</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            The company you’re looking for doesn’t exist or you don’t have
            access to view it.
          </p>
        </div>
        <Link to="/companies">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to companies
          </Button>
        </Link>
      </div>
    )
  },
})

export default function CompanyDetailsPage() {
  return (
    <Suspense fallback={<CompanyDetailLoadingFallback />}>
      <CompanyDetailView />
    </Suspense>
  )
}
