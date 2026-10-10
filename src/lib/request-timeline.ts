import {
  INVOICE_STATUS,
  REQUEST_REPORT_STATUS,
  REQUEST_STATUS,
  type RequestReportItem,
  type RequestStatusValue,
  type TRequest,
  type TRequestInvoice,
} from '@/types/request'

type TimelineShape = Pick<TRequest, 'status'> & {
  invoice?: Pick<TRequestInvoice, 'status'> | null
  requestReports?: Array<Pick<RequestReportItem, 'status'>>
}

export type TimelineStepState = 'done' | 'current' | 'upcoming' | 'stopped'

export type TimelineStep = {
  status: RequestStatusValue
  label: string
  state: TimelineStepState
}

const FLOW: Array<{ status: RequestStatusValue; label: string }> = [
  { status: REQUEST_STATUS.UNDER_REVIEW, label: 'Under review' },
  { status: REQUEST_STATUS.INVOICE_GENERATED, label: 'Invoice' },
  { status: REQUEST_STATUS.PAID, label: 'Paid' },
  { status: REQUEST_STATUS.PROCESSING, label: 'Processing' },
  { status: REQUEST_STATUS.COMPLETED, label: 'Completed' },
]

/**
 * The API has no status history, so for a closed request we infer how far it
 * got from what it left behind: a paid invoice, any invoice, or Deliveries.
 */
function reachedIndexBeforeClosing(request: TimelineShape): number {
  const delivered = (request.requestReports ?? []).some(
    (l) => l.status === REQUEST_REPORT_STATUS.DELIVERED,
  )
  if (delivered) return 3
  if (request.invoice?.status === INVOICE_STATUS.PAID) return 2
  if (request.invoice) return 1
  return 0
}

/**
 * Steps reached so far; a rejected or cancelled request ends with a `stopped`
 * step where it closed and drops the steps it never reached.
 */
export function buildRequestTimeline(
  request: TimelineShape,
): Array<TimelineStep> {
  const closed =
    request.status === REQUEST_STATUS.REJECTED ||
    request.status === REQUEST_STATUS.CANCELLED

  if (closed) {
    const reached = reachedIndexBeforeClosing(request)
    return [
      ...FLOW.slice(0, reached + 1).map((s) => ({
        ...s,
        state: 'done' as const,
      })),
      {
        status: request.status,
        label:
          request.status === REQUEST_STATUS.REJECTED ? 'Rejected' : 'Cancelled',
        state: 'stopped',
      },
    ]
  }

  const current = FLOW.findIndex((s) => s.status === request.status)
  const isCompleted = request.status === REQUEST_STATUS.COMPLETED
  return FLOW.map((s, idx) => ({
    ...s,
    state:
      idx < current || (idx === current && isCompleted)
        ? 'done'
        : idx === current
          ? 'current'
          : 'upcoming',
  }))
}
