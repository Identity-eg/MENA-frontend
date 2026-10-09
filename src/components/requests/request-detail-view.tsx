import { usePostHog } from '@posthog/react'
import { useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getErrorMessage } from '@/apis/base/error-handler'
import { useGetMessages } from '@/apis/messages/get-messages'
import { useSendMessage } from '@/apis/messages/send-message'
import { useCreateRequestPaymentSession } from '@/apis/requests/create-request-payment-session'
import { downloadRequestInvoicePdf } from '@/apis/requests/download-request-invoice-pdf'
import { useGetRequest } from '@/apis/requests/get-request'
import {
  canDownloadInvoice,
  getInvoiceDisplay,
  isRequestPayable,
} from '@/lib/request-billing'
import { REQUEST_STATUS } from '@/types/request'
import { buildRequestDetailSubjects } from './build-request-detail-subjects'
import { RequestDetailActiveSubjectSection } from './request-detail-active-subject-section'
import { RequestDetailBreadcrumb } from './request-detail-breadcrumb'
import {
  OWNER_CANCELLABLE_STATUSES,
  RequestDetailCancelButton,
} from './request-detail-cancel-button'
import { formatRequestDate, formatRequestId } from './request-detail-formatters'
import { RequestDetailHero } from './request-detail-hero'
import { RequestDetailMessagesCard } from './request-detail-messages-card'
import { RequestDetailPaymentProcessingBanner } from './request-detail-payment-processing-banner'
import { RequestDetailStatusDescriptionCard } from './request-detail-status-description-card'
import { RequestDetailSubjectsSidebar } from './request-detail-subjects-sidebar'
import { RequestDetailTimelineNav } from './request-detail-timeline-nav'
import { useRequestDetailTimeline } from './use-request-detail-timeline'

const routeApi = getRouteApi('/_protected/requests/$requestId')

/** After returning from Stripe, poll until the webhook moves the request on. */
const PAYMENT_POLL_INTERVAL_MS = 3_000
const PAYMENT_POLL_TIMEOUT_MS = 60_000

export function RequestDetailView() {
  const { requestId } = routeApi.useParams()
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const id = Number(requestId)
  const queryClient = useQueryClient()
  const posthog = usePostHog()

  const returnedFromPayment = search.payment === 'success'
  const [paymentPollTimedOut, setPaymentPollTimedOut] = useState(false)

  const {
    data,
    refetch: refetchRequest,
    isFetching: isRefetchingRequest,
  } = useGetRequest(id, {
    refetchInterval: (query) =>
      returnedFromPayment &&
      !paymentPollTimedOut &&
      query.state.data?.data.status === REQUEST_STATUS.INVOICE_GENERATED
        ? PAYMENT_POLL_INTERVAL_MS
        : false,
  })
  const request = data.data

  /** Paid in Stripe, but the webhook has not landed yet: hide Pay. */
  const isPaymentProcessing =
    returnedFromPayment && request.status === REQUEST_STATUS.INVOICE_GENERATED

  useEffect(() => {
    if (search.payment !== 'cancelled') return
    toast.info('Payment cancelled. You have not been charged.')
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, payment: undefined }),
      replace: true,
    })
  }, [search.payment, navigate])

  useEffect(() => {
    if (!returnedFromPayment) return
    setPaymentPollTimedOut(false)
    const timer = setTimeout(
      () => setPaymentPollTimedOut(true),
      PAYMENT_POLL_TIMEOUT_MS,
    )
    return () => clearTimeout(timer)
  }, [returnedFromPayment])

  useEffect(() => {
    if (!returnedFromPayment) return
    if (request.status === REQUEST_STATUS.INVOICE_GENERATED) return
    if (request.status === REQUEST_STATUS.PAID) {
      toast.success('Payment received. Thank you!')
    }
    queryClient.invalidateQueries({ queryKey: ['requests'] })
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, payment: undefined }),
      replace: true,
    })
  }, [returnedFromPayment, request.status, queryClient, navigate])

  const subjects = buildRequestDetailSubjects(request)
  const [activeSubjectId, setActiveSubjectId] = useState('')

  useEffect(() => {
    if (subjects.length > 0) {
      setActiveSubjectId((prev) =>
        subjects.some((s) => s.id === prev) ? prev : subjects[0].id,
      )
    } else {
      setActiveSubjectId('')
    }
  }, [subjects])

  const formattedId = formatRequestId(request.id)
  const submittedDate = formatRequestDate(request.createdAt)
  const timeline = useRequestDetailTimeline(
    request.status,
    request.createdAt,
    request.updatedAt,
  )

  const foundSubject = subjects.find((s) => s.id === activeSubjectId)
  const activeSubject = foundSubject ?? subjects[0]
  const selectedSubject = subjects.length > 0 ? activeSubject : null

  const totalEstimatedPrice = request.totalEstimatedPrice
  const invoiceDisplay = getInvoiceDisplay(request)
  const canPay = isRequestPayable(request) && !isPaymentProcessing
  const canCancel =
    OWNER_CANCELLABLE_STATUSES.includes(request.status) && !isPaymentProcessing

  const { data: messagesData, isLoading: messagesLoading } = useGetMessages(
    request.id,
  )
  const messages = (() => {
    const list = messagesData?.data ?? []
    return [...list].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  })()

  const sendMessageMutation = useSendMessage(request.id)
  const [messageDraft, setMessageDraft] = useState('')

  const { mutate: createPaymentSession, isPending: isPaymentRedirecting } =
    useCreateRequestPaymentSession()

  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false)

  const handleDownloadInvoice = async () => {
    setIsDownloadingInvoice(true)
    try {
      await downloadRequestInvoicePdf(request.id)
    } catch {
      // The PDF endpoint answers with a blob, so its error body is not readable here.
      toast.error('Could not download the invoice. Please try again.')
    } finally {
      setIsDownloadingInvoice(false)
    }
  }

  const handlePay = () => {
    const base = window.location.origin
    createPaymentSession(
      {
        requestId: request.id,
        successUrl: `${base}/requests/${request.id}?payment=success`,
        cancelUrl: `${base}/requests/${request.id}?payment=cancelled`,
      },
      {
        onSuccess: () => {
          posthog.capture('request_payment_checkout_started', {
            request_id: request.id,
            amount_due: request.invoice?.amount,
          })
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(error, 'Could not start the payment.').message,
          )
        },
      },
    )
  }

  const handleSubmitMessage = () => {
    const content = messageDraft.trim()
    if (!content || sendMessageMutation.isPending) return
    sendMessageMutation.mutate(content, {
      onSuccess: () => {
        posthog.capture('request_message_sent', { request_id: request.id })
        setMessageDraft('')
      },
    })
  }

  const setActiveSubject = (subjectId: string) => {
    setActiveSubjectId(subjectId)
  }

  return (
    <div className="space-y-6 pb-12">
      <RequestDetailBreadcrumb formattedId={formattedId} />

      <RequestDetailHero
        formattedId={formattedId}
        status={request.status}
        subjectsCount={subjects.length}
        submittedDate={submittedDate}
        totalEstimatedPrice={totalEstimatedPrice}
        invoiceDisplay={invoiceDisplay}
        canDownloadInvoice={canDownloadInvoice(request)}
        canPay={canPay}
        isPaymentProcessing={isPaymentProcessing}
        isPaymentRedirecting={isPaymentRedirecting}
        isDownloadingInvoice={isDownloadingInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        onPay={handlePay}
        cancelAction={
          canCancel ? (
            <RequestDetailCancelButton
              requestId={request.id}
              status={request.status}
              formattedId={formattedId}
            />
          ) : null
        }
      />

      {isPaymentProcessing && (
        <RequestDetailPaymentProcessingBanner
          delayed={paymentPollTimedOut}
          isChecking={isRefetchingRequest}
          onCheckAgain={() => refetchRequest()}
        />
      )}

      <RequestDetailTimelineNav timeline={timeline} status={request.status} />

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[280px_1fr]">
        <RequestDetailSubjectsSidebar
          subjects={subjects}
          activeSubjectId={activeSubjectId}
          onSelectSubject={setActiveSubject}
        />

        <main className="space-y-6 min-w-0">
          <RequestDetailActiveSubjectSection
            selectedSubject={selectedSubject}
            subjectCount={subjects.length}
            status={request.status}
          />

          <div className="grid gap-4 sm:gap-6 items-start grid-cols-1 lg:grid-cols-2">
            <RequestDetailStatusDescriptionCard status={request.status} />

            <RequestDetailMessagesCard
              requestUserId={request.userId}
              messages={messages}
              messagesLoading={messagesLoading}
              messageDraft={messageDraft}
              onMessageDraftChange={setMessageDraft}
              isSendPending={sendMessageMutation.isPending}
              onSubmitMessage={handleSubmitMessage}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
