import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileDown,
  FileText,
  Loader2,
  MessageCircle,
  Send,
  User,
} from 'lucide-react'
import { RequestReportRow } from './-request-report-row'
import type {
  RequestReport,
  RequestReportItem,
  RequestReportUploadItem,
} from '@/types/request'
import type { RequestStatusValue, TRequest } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/EmptyState'
import { cn } from '@/lib/utils'
import { StatusPill } from '@/components/StatusPill'
import {
  getRequestQueryOptions,
  useGetRequest,
} from '@/apis/requests/get-request'
import { downloadRequestInvoicePdf } from '@/apis/requests/download-request-invoice-pdf'
import { createRequestPaymentSession } from '@/apis/requests/create-request-payment-session'
import { useGetMessages } from '@/apis/messages/get-messages'
import { useSendMessage } from '@/apis/messages/send-message'

/** Aligned with Prisma RequestStatus enum */
const statusConfig: Record<
  RequestStatusValue,
  { label: string; description: string }
> = {
  [REQUEST_STATUS.UNDER_REVIEW]: {
    label: 'Under review',
    description:
      'Your request has been received and is waiting for initial review.',
  },
  [REQUEST_STATUS.INVOICE_GENERATED]: {
    label: 'Invoice generated',
    description: 'Payment is required to begin the screening process.',
  },
  [REQUEST_STATUS.PAID]: {
    label: 'Paid',
    description: 'Payment received. Your request is queued for processing.',
  },
  [REQUEST_STATUS.PROCESSING]: {
    label: 'Processing',
    description:
      'Our analysts are currently working on your compliance reports.',
  },
  [REQUEST_STATUS.COMPLETED]: {
    label: 'Completed',
    description: 'The screening is complete. You can now download all reports.',
  },
  [REQUEST_STATUS.REJECTED]: {
    label: 'Rejected',
    description: 'This request was rejected.',
  },
  [REQUEST_STATUS.CANCELLED]: {
    label: 'Cancelled',
    description: 'This request was cancelled.',
  },
}

function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

function formatRequestDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatMessageTime(iso: string) {
  try {
    const d = new Date(iso)
    const now = new Date()
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    if (isToday) {
      return d.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })
    }
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

type ReportWithPriceAndUploads = RequestReport & {
  price: number
  upload?: RequestReportUploadItem | null
  reportStatus?: RequestReportItem['status']
  finalPrice?: number | null
}

type SubjectItem = {
  id: string
  name: string
  type: 'Company' | 'Individual'
  nationality: string
  reports: Array<ReportWithPriceAndUploads>
}

/** Unified request reports (prefer requestReports; empty when none). */
function getRequestReports(
  request: TRequest | undefined,
): Array<RequestReportItem> {
  return request?.requestReports ?? []
}

/** Build subjects from requestReports. Backend only returns requestReports (no companies/individuals/reports). */
function buildSubjects(request: TRequest | undefined): Array<SubjectItem> {
  const requestReports = getRequestReports(request)
  if (requestReports.length === 0) return []

  const companyMap = new Map<
    number,
    {
      name: string
      nationality: string
      reports: Array<ReportWithPriceAndUploads>
    }
  >()
  const individualMap = new Map<
    number,
    {
      name: string
      nationality: string
      reports: Array<ReportWithPriceAndUploads>
    }
  >()

  for (const rr of requestReports) {
    const price = rr.report.price ?? rr.report.estimatedPrice ?? 0
    const reportWithUploads: ReportWithPriceAndUploads = {
      ...rr.report,
      totalEstimatedPrice: rr.report.totalEstimatedPrice ?? price,
      price,
      upload: rr.upload ?? null,
      reportStatus: rr.status,
      finalPrice: rr.finalPrice ?? null,
    }

    if (rr.companyId != null && rr.company != null) {
      const existing = companyMap.get(rr.companyId)
      const name = rr.company.nameAr ?? rr.company.nameEn
      const nationality = rr.company.country
        ? String(rr.company.country.nameEn)
        : '—'
      if (existing) {
        const idx = existing.reports.findIndex(
          (r) => r.id === reportWithUploads.id,
        )
        if (idx >= 0) {
          const existingReport = existing.reports[
            idx
          ] as ReportWithPriceAndUploads
          if (!existingReport.upload && reportWithUploads.upload) {
            existingReport.upload = reportWithUploads.upload
          }
        } else {
          existing.reports.push(reportWithUploads)
        }
      } else {
        companyMap.set(rr.companyId, {
          name,
          nationality,
          reports: [reportWithUploads],
        })
      }
    }

    if (rr.individualId != null && rr.individual != null) {
      const existing = individualMap.get(rr.individualId)
      const name = rr.individual.fullName
      const nationality = rr.individual.nationality ?? '—'
      if (existing) {
        const idx = existing.reports.findIndex(
          (r) => r.id === reportWithUploads.id,
        )
        if (idx >= 0) {
          const existingReport = existing.reports[
            idx
          ] as ReportWithPriceAndUploads
          if (!existingReport.upload && reportWithUploads.upload) {
            existingReport.upload = reportWithUploads.upload
          }
        } else {
          existing.reports.push(reportWithUploads)
        }
      } else {
        individualMap.set(rr.individualId, {
          name,
          nationality,
          reports: [reportWithUploads],
        })
      }
    }
  }

  const companySubjects: Array<SubjectItem> = Array.from(
    companyMap.entries(),
  ).map(([companyId, { name, nationality, reports }]) => ({
    id: `company-${companyId}`,
    name,
    type: 'Company' as const,
    nationality,
    reports,
  }))
  const individualSubjects: Array<SubjectItem> = Array.from(
    individualMap.entries(),
  ).map(([individualId, { name, nationality, reports }]) => ({
    id: `individual-${individualId}`,
    name,
    type: 'Individual' as const,
    nationality,
    reports,
  }))

  return [...companySubjects, ...individualSubjects]
}

/** Ordered flow for timeline (Prisma RequestStatus) */
const TIMELINE_STATUSES: Array<RequestStatusValue> = [
  REQUEST_STATUS.UNDER_REVIEW,
  REQUEST_STATUS.INVOICE_GENERATED,
  REQUEST_STATUS.PAID,
  REQUEST_STATUS.PROCESSING,
  REQUEST_STATUS.COMPLETED,
]

function RequestDetailsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32">
      <div className="relative">
        <div className="h-14 w-14 rounded-2xl bg-muted/80 animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-foreground">
          Loading request details...
        </p>
        <p className="text-xs text-muted-foreground">
          Fetching status and deliverables
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_protected/requests/$requestId')({
  component: RequestDetailsPage,
  loader: async ({ context, params }) => {
    const requestId = Number(params.requestId)
    if (Number.isNaN(requestId)) throw notFound()
    try {
      await context.queryClient.ensureQueryData(
        getRequestQueryOptions(requestId),
      )
    } catch {
      throw notFound()
    }
  },
  errorComponent: () => (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="rounded-full bg-destructive/10 p-4">
        <FileText className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          We couldn&apos;t load this request. Please try again or return to your
          requests.
        </p>
      </div>
      <Link to="/requests">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to requests
        </Button>
      </Link>
    </div>
  ),
  pendingComponent: RequestDetailsLoadingFallback,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <div className="rounded-full bg-muted p-4">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Request not found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          This request doesn&apos;t exist or you don&apos;t have access to view
          it.
        </p>
      </div>
      <Link to="/requests">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to requests
        </Button>
      </Link>
    </div>
  ),
})

function RequestDetailsPage() {
  const { requestId } = Route.useParams()
  const id = Number(requestId)
  const { data } = useGetRequest(id)
  const request = data.data

  const subjects = useMemo(() => buildSubjects(request), [request])
  const [activeSubjectId, setActiveSubjectId] = useState<string>('')
  const [isPaymentRedirecting, setIsPaymentRedirecting] = useState(false)

  useEffect(() => {
    if (subjects.length > 0) {
      setActiveSubjectId((prev) =>
        subjects.some((s) => s.id === prev) ? prev : subjects[0].id,
      )
    } else {
      setActiveSubjectId('')
    }
  }, [subjects])

  const status = request.status
  const config = statusConfig[status]
  const foundSubject = subjects.find((s) => s.id === activeSubjectId)
  const activeSubject = foundSubject ?? subjects[0]
  const selectedSubject = subjects.length > 0 ? activeSubject : null
  const totalEstimatedPrice = request.totalEstimatedPrice
  const amountDue = request.invoice?.amount ?? totalEstimatedPrice

  const { data: messagesData, isLoading: messagesLoading } = useGetMessages(
    request.id,
  )
  const messages = useMemo(() => {
    const list = messagesData?.data ?? []
    return [...list].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }, [messagesData?.data])
  const sendMessageMutation = useSendMessage(request.id)
  const [messageDraft, setMessageDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const currentStepIndex = TIMELINE_STATUSES.indexOf(status)
  const isRejectedOrCancelled =
    status === REQUEST_STATUS.REJECTED || status === REQUEST_STATUS.CANCELLED
  const submittedDate = formatRequestDate(request.createdAt)
  const updatedDate = formatRequestDate(request.updatedAt)
  const timeline = useMemo(
    () =>
      TIMELINE_STATUSES.map((s, idx) => {
        const active = idx <= currentStepIndex
        const date =
          active && !isRejectedOrCancelled
            ? idx === 0
              ? submittedDate
              : updatedDate
            : 'Pending'
        return {
          status: s,
          label: statusConfig[s].label,
          date,
          active: active || (idx === currentStepIndex && isRejectedOrCancelled),
        }
      }),
    [currentStepIndex, isRejectedOrCancelled, submittedDate, updatedDate],
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/requests"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Requests
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <span className="font-medium text-foreground">
          {formatRequestId(request.id)}
        </span>
      </nav>

      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-card via-card to-muted/30 px-6 py-6 shadow-sm sm:px-8 sm:py-7">
        <div className="absolute right-0 top-0 h-24 w-40 bg-linear-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {formatRequestId(request.id)}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusPill status={status} className="shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {subjects.length > 0
                      ? `${subjects.length} subject${subjects.length === 1 ? '' : 's'} · ${submittedDate}`
                      : submittedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-stretch gap-3">
            {status === REQUEST_STATUS.INVOICE_GENERATED && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => downloadRequestInvoicePdf(request.id)}
                >
                  <FileDown className="h-4 w-4" />
                  Invoice
                </Button>
                <Button
                  size="sm"
                  className="gap-2 bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500 border-none shadow-sm"
                  disabled={isPaymentRedirecting}
                  onClick={async () => {
                    setIsPaymentRedirecting(true)
                    try {
                      const { url } = await createRequestPaymentSession(
                        request.id,
                      )
                      window.location.href = url
                    } catch {
                      setIsPaymentRedirecting(false)
                    }
                  }}
                >
                  {isPaymentRedirecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}{' '}
                  Pay ${amountDue.toLocaleString()}
                </Button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border px-4 py-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Estimated
                </p>
                <p className="text-lg font-bold tabular-nums tracking-tight">
                  ${totalEstimatedPrice.toLocaleString()}
                </p>
              </div>
              {request.invoice != null && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Amount due
                  </p>
                  <p className="text-lg font-bold tabular-nums tracking-tight text-primary">
                    ${request.invoice.amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Timeline stepper */}
      <nav
        aria-label="Request status"
        className="rounded-xl border bg-card px-4 py-4"
      >
        <div className="flex w-full items-start">
          {timeline.map((step, idx) => (
            <div
              key={step.status}
              className={cn(
                'flex flex-1 min-w-0 flex-col items-center gap-2 text-center',
                idx < timeline.length - 1 && 'mr-2 sm:mr-4',
              )}
            >
              <div
                role="listitem"
                aria-current={status === step.status ? 'step' : undefined}
                className="flex w-full flex-col items-center gap-2"
              >
                <div className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                      step.active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted bg-muted/30 text-muted-foreground',
                      status === step.status &&
                        'ring-2 ring-primary ring-offset-2 ring-offset-background',
                    )}
                  >
                    {idx + 1}
                  </span>
                  {idx < timeline.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-1/2 top-5 h-0.5 w-full min-w-[24px] -translate-x-1/2',
                        step.active ? 'bg-primary/50' : 'bg-muted',
                      )}
                      style={{ width: 'calc(100% + 1rem)' }}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium leading-tight',
                    step.active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {step.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar: Subject selection */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Subjects in Request
              </CardTitle>
              <p className="text-xs text-muted-foreground font-normal">
                {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
              </p>
            </CardHeader>
            <CardContent
              className="space-y-2 pt-0"
              role="tablist"
              aria-label="Subjects"
            >
              {subjects.length === 0 ? (
                <EmptyState
                  icon={User}
                  title="No subjects"
                  description="This request has no subjects yet."
                  className="py-8"
                />
              ) : (
                subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSubjectId === s.id}
                    onClick={() => setActiveSubjectId(s.id)}
                    className={cn(
                      'w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      activeSubjectId === s.id
                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30 text-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        activeSubjectId === s.id
                          ? 'bg-primary-foreground/20'
                          : 'bg-muted',
                      )}
                    >
                      {s.type === 'Individual' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate text-sm font-semibold"
                        dir={s.type === 'Individual' ? 'rtl' : 'ltr'}
                      >
                        {s.name}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-medium uppercase tracking-wider',
                          activeSubjectId === s.id
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground',
                        )}
                      >
                        {s.type} · {s.reports.length} report
                        {s.reports.length !== 1 ? 's' : ''}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Main: Active subject & deliverables */}
        <main className="space-y-6 min-w-0">
          {selectedSubject ? (
            <Card className="overflow-hidden rounded-xl">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b bg-muted/5">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {selectedSubject.type === 'Individual' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <CardTitle
                      className="text-xl font-semibold"
                      dir={
                        selectedSubject.type === 'Individual' ? 'rtl' : 'ltr'
                      }
                    >
                      {selectedSubject.name}
                    </CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {selectedSubject.type} · {selectedSubject.nationality}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 py-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Assigned Services & Reports
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedSubject.reports.map((report) => (
                    <RequestReportRow
                      key={report.id}
                      report={report}
                      status={status}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={Building2}
                  title={
                    subjects.length === 0
                      ? 'No subjects in this request'
                      : 'Select a subject'
                  }
                  description={
                    subjects.length === 0
                      ? 'This request has no subjects yet.'
                      : 'Choose a subject from the sidebar to view their reports.'
                  }
                />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 items-start sm:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    status === REQUEST_STATUS.COMPLETED
                      ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400'
                      : 'bg-primary/10 text-primary',
                  )}
                >
                  {status === REQUEST_STATUS.COMPLETED ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Activity className="h-5 w-5 animate-pulse" />
                  )}
                </span>
                <div className="min-w-0 space-y-1">
                  <h3 className="text-sm font-semibold">{config.label}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold tracking-tight">
                      Messages
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Questions about this request? Reply here.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-5 pt-0">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-3 max-h-[280px] min-h-[120px] overflow-y-auto rounded-xl border bg-muted/20 p-3">
                      {messages.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                          <div className="rounded-full bg-muted p-3">
                            <MessageCircle className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <p className="mt-3 text-sm font-medium text-foreground">
                            No messages yet
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Send a message to start the conversation
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isOwn =
                            Number(msg.senderId) === Number(request.userId)
                          return (
                            <div
                              key={msg.id}
                              className={cn(
                                'flex flex-col gap-0.5 max-w-[85%]',
                                isOwn
                                  ? 'self-end items-end'
                                  : 'self-start items-start',
                              )}
                            >
                              <div
                                className={cn(
                                  'rounded-xl px-3 py-2 text-sm',
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted border',
                                )}
                              >
                                {!isOwn && (
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                    {msg.sender.name}
                                    {msg.sender.role === 'ADMIN' && (
                                      <span className="ml-1.5 text-primary">
                                        · Support
                                      </span>
                                    )}
                                  </p>
                                )}
                                <p className="whitespace-pre-wrap wrap-break-word">
                                  {msg.content}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  'text-[10px] text-muted-foreground',
                                  isOwn ? 'mr-1' : 'ml-1',
                                )}
                              >
                                {formatMessageTime(msg.createdAt)}
                              </span>
                            </div>
                          )
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault()
                        const content = messageDraft.trim()
                        if (!content || sendMessageMutation.isPending) return
                        sendMessageMutation.mutate(content, {
                          onSuccess: () => setMessageDraft(''),
                        })
                      }}
                    >
                      <Input
                        placeholder="Type a message…"
                        className="h-9 flex-1 text-sm"
                        value={messageDraft}
                        onChange={(e) => setMessageDraft(e.target.value)}
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-9 shrink-0 px-3"
                        disabled={
                          !messageDraft.trim() || sendMessageMutation.isPending
                        }
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" aria-hidden />
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
