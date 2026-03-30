import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useGetRequest } from '@/apis/requests/get-request'
import { downloadRequestInvoicePdf } from '@/apis/requests/download-request-invoice-pdf'
import { useCreateRequestPaymentSession } from '@/apis/requests/create-request-payment-session'
import { useGetMessages } from '@/apis/messages/get-messages'
import { useSendMessage } from '@/apis/messages/send-message'
import { buildRequestDetailSubjects } from './build-request-detail-subjects'
import { formatRequestDate, formatRequestId } from './request-detail-formatters'
import { RequestDetailActiveSubjectSection } from './request-detail-active-subject-section'
import { RequestDetailBreadcrumb } from './request-detail-breadcrumb'
import { RequestDetailHero } from './request-detail-hero'
import { RequestDetailMessagesCard } from './request-detail-messages-card'
import { RequestDetailStatusDescriptionCard } from './request-detail-status-description-card'
import { RequestDetailSubjectsSidebar } from './request-detail-subjects-sidebar'
import { RequestDetailTimelineNav } from './request-detail-timeline-nav'
import { useRequestDetailTimeline } from './use-request-detail-timeline'

const routeApi = getRouteApi('/_protected/requests/$requestId')

export function RequestDetailView() {
  const { requestId } = routeApi.useParams()
  const id = Number(requestId)
  const { data } = useGetRequest(id)
  const request = data.data

  const subjects = useMemo(
    () => buildRequestDetailSubjects(request),
    [request],
  )
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

  const { mutate: createPaymentSession, isPending: isPaymentRedirecting } =
    useCreateRequestPaymentSession()

  const handleDownloadInvoice = useCallback(() => {
    downloadRequestInvoicePdf(request.id)
  }, [request.id])

  const handlePay = useCallback(() => {
    createPaymentSession(request.id)
  }, [createPaymentSession, request.id])

  const handleSubmitMessage = useCallback(() => {
    const content = messageDraft.trim()
    if (!content || sendMessageMutation.isPending) return
    sendMessageMutation.mutate(content, {
      onSuccess: () => setMessageDraft(''),
    })
  }, [messageDraft, sendMessageMutation])

  const setActiveSubject = useCallback((subjectId: string) => {
    setActiveSubjectId(subjectId)
  }, [])

  return (
    <div className="space-y-6 pb-12">
      <RequestDetailBreadcrumb formattedId={formattedId} />

      <RequestDetailHero
        formattedId={formattedId}
        status={request.status}
        subjectsCount={subjects.length}
        submittedDate={submittedDate}
        totalEstimatedPrice={totalEstimatedPrice}
        amountDue={amountDue}
        invoice={request.invoice}
        isPaymentRedirecting={isPaymentRedirecting}
        onDownloadInvoice={handleDownloadInvoice}
        onPay={handlePay}
      />

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
