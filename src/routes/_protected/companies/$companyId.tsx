import { Suspense, useEffect, useState } from 'react'
import {
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
import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RequestScreeningPackageButton } from '@/components/request-screening-package-button'
import { cn } from '@/lib/utils'
import {
  getCompanyQueryOptions,
  useGetCompany,
} from '@/apis/company/get-company'
import {
  getReportsQueryOptions,
  useGetReports,
} from '@/apis/reports/get-reports'
import { createUnlockPaymentSession } from '@/apis/unlocks/create-unlock-payment-session'
import { useQueryClient } from '@tanstack/react-query'
import { getUnlocksQueryOptions } from '@/apis/unlocks/get-unlocks'

function CompanyDetailsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">
        Loading company...
      </p>
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

    await context.queryClient.ensureQueryData(
      getReportsQueryOptions({ isActive: true }),
    )
  },
  errorComponent() {
    return <div>Error loading company</div>
  },
  pendingComponent: () => <div>Loading company...</div>,
  notFoundComponent() {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-medium">Company not found</p>
        <p className="text-sm text-muted-foreground">
          The company you’re looking for doesn’t exist or you don’t have access.
        </p>
      </div>
    )
  },
})

function CompanyDetailsContent() {
  const { companyId } = Route.useParams()
  const id = Number(companyId)
  const queryClient = useQueryClient()
  const { data: companyData } = useGetCompany(id)
  const { data: reportsData } = useGetReports({ isActive: true })
  const company = companyData.data
  const reports = reportsData.data

  const [selectedReports, setSelectedReports] = useState<Array<number>>([])
  const [unlockingFieldId, setUnlockingFieldId] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('unlock') === 'success') {
      queryClient.invalidateQueries({
        queryKey: getCompanyQueryOptions(id).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getUnlocksQueryOptions().queryKey,
      })
      window.history.replaceState(null, '', window.location.pathname)
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
    .reduce((acc, r) => acc + r.price, 0)

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
      const base = window.location.origin
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

  const getFieldIcon = (key: string) => {
    switch (key) {
      case 'phone':
        return Phone
      case 'address':
        return MapPin
      case 'email':
        return Mail
      default:
        return Lock
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1
            className="text-3xl font-serif font-bold tracking-tight"
            dir="rtl"
          >
            {company.nameAr ?? company.nameEn}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">{company.nameEn}</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1 text-xs">
              <Globe className="h-3 w-3" />
              {company.country.nameEn}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
                            disabled={unlockingFieldId === locked.id}
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
                          unlockingFieldId != null || lockedFields.length === 0
                        }
                        onClick={() => {
                          const first = lockedFields[0]
                          if (!first) return
                          const locked = getLockedFieldByFieldName(first.key)
                          if (locked) handleUnlock(locked.id)
                        }}
                      >
                        {unlockingFieldId != null ? (
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

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold tracking-tight">
                Company Profile
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Public information
              </p>
            </CardHeader>
            <CardContent>
              {publicFields.length > 0 ? (
                <div className="divide-y">
                  {publicFields.map(({ key, label, value }) => (
                    <div
                      key={key}
                      className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {label}
                      </span>
                      <p className="text-sm text-foreground wrap-break-word">
                        {value ?? '—'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No public details available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-primary" /> Available
                Compliance Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No reports available for this company.
                </p>
              ) : (
                <div className="grid gap-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => toggleReport(report.id)}
                      className={cn(
                        'group relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer bg-white',
                        selectedReports.includes(report.id)
                          ? 'border-primary ring-1 ring-primary/20'
                          : 'hover:border-primary/30 hover:bg-accent/50',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center transition-colors',
                            selectedReports.includes(report.id)
                              ? 'bg-primary border-primary'
                              : 'bg-background',
                          )}
                        >
                          {selectedReports.includes(report.id) && (
                            <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{report.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold px-1.5 text-muted-foreground"
                            >
                              TAT: {report.turnaround}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">
                          ${report.price}
                        </div>
                        <div className="text-[10px] uppercase text-muted-foreground/60 font-bold mt-1">
                          Estimated
                        </div>
                      </div>
                    </div>
                  ))}
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Country</span>
                <span className="font-medium">{company.country.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span className="font-medium">{company.industry}</span>
              </div>
            </CardContent>
          </Card>
        </div>
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
