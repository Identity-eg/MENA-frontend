import { Suspense, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  Globe,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Unlock,
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
  getCompanyQueryOptions,
  useGetCompany,
} from '@/apis/company/get-company'
import type { TReport } from '@/types/report'
import { createUnlockPaymentSession } from '@/apis/unlocks/create-unlock-payment-session'
import { createUnlockAllPaymentSession } from '@/apis/unlocks/create-unlock-all-payment-session'
import { useQueryClient } from '@tanstack/react-query'
import { getUnlocksQueryOptions } from '@/apis/unlocks/get-unlocks'

function CompanyDetailsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32">
      <div className="relative">
        <div className="h-14 w-14 rounded-2xl bg-muted/80 animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-foreground">
          Loading company details...
        </p>
        <p className="text-xs text-muted-foreground">
          Fetching profile and compliance data
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_protected/companies/$companyId')({
  component: CompanyDetailsPage,
  loader: async ({ context, params }) => {
    const companyId = params.companyId

    try {
      await context.queryClient.ensureQueryData(
        getCompanyQueryOptions(Number(companyId)),
      )
    } catch (err) {
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
  pendingComponent: () => <CompanyDetailsLoadingFallback />,
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

function CompanyDetailsContent() {
  const { companyId } = Route.useParams()
  const id = Number(companyId)
  const queryClient = useQueryClient()
  const { data: companyData } = useGetCompany(id)
  const company = companyData.data
  const reports: TReport[] = company.reports ?? []

  const [selectedReports, setSelectedReports] = useState<Array<number>>([])
  const [unlockingFieldId, setUnlockingFieldId] = useState<number | null>(null)
  const [unlockingAll, setUnlockingAll] = useState(false)
  const [showUnlockSuccessBanner, setShowUnlockSuccessBanner] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('unlock') === 'success') {
      setShowUnlockSuccessBanner(true)
      queryClient.invalidateQueries({
        queryKey: getCompanyQueryOptions(id).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getUnlocksQueryOptions().queryKey,
      })
      window.history.replaceState(null, '', window.location.pathname)
      const t = setTimeout(() => setShowUnlockSuccessBanner(false), 5000)
      return () => clearTimeout(t)
    }
  }, [id, queryClient])

  const toggleReport = (reportId: number) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((x) => x !== reportId)
        : [...prev, reportId],
    )
  }

  const totalPrice = reports
    .filter((r) => selectedReports.includes(r.id))
    .reduce((acc: number, r) => acc + r.price, 0)

  const getLockedFieldByFieldName = (fieldName: string) =>
    company.lockedFields.find((lf) => lf.lockedType.fieldName === fieldName)

  const profileFields: Array<{
    key: string
    label: string
    value: string | null
  }> = [
    {
      key: 'registrationNumber',
      label: 'Registration Number',
      value: company.registrationNumber,
    },
    { key: 'legalForm', label: 'Legal Type', value: company.legalForm },
    { key: 'industry', label: 'Industry', value: company.industry },
    { key: 'foundedDate', label: 'Founded', value: company.foundedDate },
    { key: 'size', label: 'Size', value: company.size },
    { key: 'address', label: 'Address', value: company.address },
    { key: 'city', label: 'City', value: company.city },
    { key: 'country', label: 'Country', value: company.country.nameEn },
    { key: 'phone', label: 'Phone', value: company.phone },
    { key: 'email', label: 'Email', value: company.email },
    { key: 'website', label: 'Website', value: company.website },
    { key: 'description', label: 'Description', value: company.description },
  ]

  const purchasedUnlockFields = profileFields.filter(({ key }) => {
    const locked = getLockedFieldByFieldName(key)
    return locked != null && locked.unlocks.length > 0
  })

  const publicFields = profileFields.filter(({ key }) => {
    const locked = getLockedFieldByFieldName(key)
    return locked == null
  })

  const lockedFields = profileFields.filter(({ key }) => {
    const locked = getLockedFieldByFieldName(key)
    return locked != null && locked.unlocks.length === 0
  })

  const totalUnlockPrice = lockedFields.reduce((sum, { key }) => {
    const locked = getLockedFieldByFieldName(key)
    return sum + (locked?.price ?? 0)
  }, 0)

  const handleUnlock = async (lockedFieldId: number) => {
    setUnlockingFieldId(lockedFieldId)
    try {
      const base = import.meta.env.VITE_HOME_URL
      const { url } = await createUnlockPaymentSession(
        lockedFieldId,
        `${base}/companies/${id}?unlock=success`,
        `${base}/companies/${id}?unlock=cancelled`,
      )
      window.location.href = url
    } catch {
      setUnlockingFieldId(null)
    }
  }

  const handleUnlockAll = async () => {
    const ids = lockedFields
      .map(({ key }) => getLockedFieldByFieldName(key)?.id)
      .filter((id): id is number => id != null)
    if (ids.length === 0) return
    setUnlockingAll(true)
    try {
      const base = window.location.origin
      const { url } = await createUnlockAllPaymentSession(
        ids,
        `${base}/companies/${id}?unlock=success`,
        `${base}/companies/${id}?unlock=cancelled`,
      )
      window.location.href = url
    } catch {
      setUnlockingAll(false)
    }
  }

  const getFieldIcon = (key: string) => {
    switch (key) {
      case 'phone':
        return Phone
      case 'address':
        return MapPin
      case 'email':
        return Mail
      case 'website':
        return Globe
      default:
        return Lock
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & back */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/companies"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Companies
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
          {company.nameEn}
        </span>
      </nav>

      {/* Success banner */}
      {showUnlockSuccessBanner && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="font-medium">
            Unlock successful. Your data is now visible below.
          </p>
        </div>
      )}

      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-card via-card to-muted/30 px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="absolute right-0 top-0 h-32 w-48 bg-linear-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h1
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                  dir="rtl"
                >
                  {company.nameEn}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {company.nameAr}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                {company.country.nameEn}
              </span>
              {company.industry && (
                <>
                  <span className="hidden sm:inline text-muted-foreground/40">
                    •
                  </span>
                  <span>{company.industry}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          {lockedFields.length > 0 && (
            <Card className="relative overflow-hidden rounded-2xl border-0 bg-linear-to-b from-primary/8 via-primary/5 to-transparent shadow-lg ring-1 ring-primary/10 dark:from-primary/15 dark:via-primary/10 dark:to-transparent dark:ring-primary/20">
              {/* Subtle grid pattern */}
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
                        Unlock verified contact and location data for due
                        diligence and compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lockedFields.map(({ key, label, value }) => {
                    const locked = getLockedFieldByFieldName(key)
                    if (!locked) return null
                    const FieldIcon = getFieldIcon(key)
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
                            disabled={
                              unlockingFieldId === locked.id || unlockingAll
                            }
                            onClick={() => handleUnlock(locked.id)}
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
                        onClick={handleUnlockAll}
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
          )}

          {/* Unlocked (purchased) fields – highlighted */}
          {purchasedUnlockFields.length > 0 && (
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
                    {purchasedUnlockFields.length} unlocked
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {purchasedUnlockFields.map(({ key, label, value }) => {
                    const FieldIcon = getFieldIcon(key)
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
          )}

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold tracking-tight">
                    Company Profile
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Public information
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {publicFields.length > 0 ? (
                <div className="space-y-1">
                  {publicFields.map(({ key, label, value }) => (
                    <div
                      key={key}
                      className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                        {label}
                      </span>
                      <p className="text-sm text-foreground wrap-break-word">
                        {value ?? '—'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Building2}
                  title="No public details"
                  description="This company has no public profile information available."
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
                  description="There are no compliance reports available for this company at the moment."
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
                            ${report.price}
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
                companyId={id}
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
                <span className="text-muted-foreground">Country</span>
                <span className="font-medium text-right">
                  {company.country.nameEn}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Industry</span>
                <span className="font-medium text-right">
                  {company.industry ?? '—'}
                </span>
              </div>
              {company.legalForm && (
                <>
                  <Separator />
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Legal type</span>
                    <span className="font-medium text-right">
                      {company.legalForm}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {lockedFields.length > 0 && (
            <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Premium fields available
                </p>
                <p className="text-2xl font-bold text-primary">
                  {lockedFields.length} locked
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Unlock individually or all at once below
                </p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}

export default function CompanyDetailsPage() {
  return (
    <Suspense fallback={<CompanyDetailsLoadingFallback />}>
      <CompanyDetailsContent />
    </Suspense>
  )
}
