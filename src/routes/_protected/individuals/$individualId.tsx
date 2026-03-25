import { Suspense, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  Globe,
  Loader2,
  MapPin,
  User,
  Calendar,
  CreditCard,
  Briefcase,
  Mail,
  Phone,
} from 'lucide-react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RequestScreeningPackageButton } from '@/components/request-screening-package-button'
import { EmptyState } from '@/components/EmptyState'
import { cn } from '@/lib/utils'
import {
  getIndividualQueryOptions,
  useGetIndividual,
} from '@/apis/individual/get-individual'
import { displayIndividualName } from '@/types/individual'

function IndividualDetailsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32">
      <div className="relative">
        <div className="h-14 w-14 rounded-2xl bg-muted/80 animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-foreground">
          Loading individual details...
        </p>
        <p className="text-xs text-muted-foreground">
          Fetching profile and compliance data
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_protected/individuals/$individualId')({
  component: IndividualDetailsPage,
  loader: async ({ context, params }) => {
    const individualId = params.individualId

    try {
      await context.queryClient.ensureQueryData(
        getIndividualQueryOptions(Number(individualId)),
      )
    } catch (err) {
      throw notFound()
    }
  },
  errorComponent() {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24">
        <div className="rounded-full bg-destructive/10 p-4">
          <User className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            We couldn’t load this individual. Please try again or return to the
            search.
          </p>
        </div>
        <Link to="/individuals">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to individuals
          </Button>
        </Link>
      </div>
    )
  },
  pendingComponent: () => <IndividualDetailsLoadingFallback />,
  notFoundComponent() {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24">
        <div className="rounded-full bg-muted p-4">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold">Individual not found</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            The individual you’re looking for doesn’t exist or you don’t have
            access to view it.
          </p>
        </div>
        <Link to="/individuals">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to individuals
          </Button>
        </Link>
      </div>
    )
  },
})

function formatDob(dateString: string | null) {
  if (!dateString) return '—'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function IndividualDetailsContent() {
  const { individualId } = Route.useParams()
  const id = Number(individualId)
  const { data: individualData } = useGetIndividual(id)
  const individual = individualData.data
  const reports = individual.reports || []

  const [selectedReports, setSelectedReports] = useState<Array<number>>([])

  const toggleReport = (reportId: number) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((x) => x !== reportId)
        : [...prev, reportId],
    )
  }

  const totalPrice = reports
    .filter((r) => selectedReports.includes(r.id))
    .reduce((acc: number, r) => acc + (r.estimatedPrice ?? 0), 0)

  const publicFields: Array<{
    key: string
    label: string
    value: string | null
    icon?: React.ElementType
  }> = [
    { key: 'email', label: 'Email', value: individual.email, icon: Mail },
    { key: 'phone', label: 'Phone', value: individual.phone, icon: Phone },
    {
      key: 'position',
      label: 'Position',
      value: individual.position,
      icon: Briefcase,
    },
    {
      key: 'idNumber',
      label: 'ID Number',
      value: individual.idNumber,
      icon: CreditCard,
    },
    {
      key: 'dateOfBirth',
      label: 'Date of Birth',
      value: formatDob(individual.dateOfBirth),
      icon: Calendar,
    },
    {
      key: 'address',
      label: 'Address',
      value: individual.address,
      icon: MapPin,
    },
    { key: 'city', label: 'City', value: individual.city, icon: MapPin },
    {
      key: 'country',
      label: 'Country',
      value: individual.country?.nameEn || individual.countryCode,
      icon: Globe,
    },
  ]

  const visibleFields = publicFields.filter((f) => f.value && f.value !== '—')

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & back */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/individuals"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Individuals
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="font-medium text-foreground truncate max-w-50 sm:max-w-none">
          {displayIndividualName(individual)}
        </span>
      </nav>

      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-card via-card to-muted/30 px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="absolute right-0 top-0 h-32 w-48 bg-linear-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {displayIndividualName(individual)}
                </h1>
                <p className="text-sm text-muted-foreground truncate uppercase tracking-wider mt-0.5 font-medium">
                  {individual.position || 'Individual'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground pt-1">
              {(individual.country?.nameEn || individual.countryCode) && (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  {individual.country?.nameEn || individual.countryCode}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold tracking-tight">
                    Individual Profile
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Public information
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {visibleFields.length > 0 ? (
                <div className="space-y-1">
                  {visibleFields.map(({ key, label, value }) => (
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
              ) : (
                <EmptyState
                  icon={User}
                  title="No details available"
                  description="This individual has no extended profile information available."
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileSearch className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    Compliance Reports
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Request screening packages for due diligence
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.length === 0 ? (
                <EmptyState
                  icon={FileSearch}
                  title="No reports available"
                  description="There are no compliance reports available for this individual at the moment."
                />
              ) : (
                <div className="grid gap-3">
                  {reports.map((report) => {
                    const isSelected = selectedReports.includes(report.id)
                    return (
                      <button
                        key={report.id}
                        type="button"
                        onClick={() => toggleReport(report.id)}
                        className={cn(
                          'group relative flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20 dark:bg-primary/10'
                            : 'border-border hover:border-primary/40 hover:bg-muted/50',
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <div
                            className={cn(
                              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground/30 group-hover:border-primary/50',
                            )}
                          >
                            {isSelected && (
                              <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm">
                              {report.name}
                            </h4>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {report.description}
                            </p>
                            <Badge
                              variant="secondary"
                              className="mt-2 text-[10px] font-medium"
                            >
                              TAT: {report.turnaround}
                            </Badge>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-sm font-bold text-primary">
                            ${report.estimatedPrice}
                          </span>
                          <p className="text-[10px] text-muted-foreground">
                            Est.
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t bg-accent/20 pt-6">
              <div className="flex w-full items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-muted-foreground">
                    Selection Summary
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {selectedReports.length} reports selected
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase text-muted-foreground">
                    Total Estimate
                  </div>
                  <div className="text-xl font-bold text-primary">
                    ${totalPrice}
                  </div>
                </div>
              </div>
              <RequestScreeningPackageButton
                individualId={id}
                selectedReportIds={selectedReports}
                disabled={selectedReports.length === 0}
              />
            </CardFooter>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Quick info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Residence</span>
                <span className="font-medium text-right">
                  {individual.country?.nameEn || individual.countryCode || '—'}
                </span>
              </div>
              {individual.position && (
                <>
                  <Separator />
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-medium text-right">
                      {individual.position}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default function IndividualDetailsPage() {
  return (
    <Suspense fallback={<IndividualDetailsLoadingFallback />}>
      <IndividualDetailsContent />
    </Suspense>
  )
}
