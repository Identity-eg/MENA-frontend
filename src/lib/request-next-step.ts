import {
  INVOICE_STATUS,
  REQUEST_REPORT_STATUS,
  REQUEST_STATUS,
  type RequestReportItem,
  type TRequest,
  type TRequestInvoice,
} from '@/types/request'
import { isLineRejected, isRequestPayable } from './request-billing'

type NextStepShape = Pick<TRequest, 'status'> & {
  invoice?: Pick<TRequestInvoice, 'status' | 'amount'> | null
  requestReports?: Array<Pick<RequestReportItem, 'status'>>
}

/**
 * The single thing the customer must do — or is waiting on — for a Request to
 * move forward. `actionable` means the customer has something to do.
 */
export type NextStep =
  | { kind: 'review'; actionable: false }
  | { kind: 'pay'; actionable: true; amount: number; overdue: boolean }
  /** INVOICE_GENERATED but the latest invoice was withdrawn: a new one is coming. */
  | { kind: 'invoice-pending'; actionable: false }
  | { kind: 'in-progress'; actionable: false; delivered: number; total: number }
  | { kind: 'download'; actionable: true; delivered: number }
  | { kind: 'rejected'; actionable: false }
  | { kind: 'cancelled'; actionable: false }

/** Delivered vs. total non-rejected Request lines. */
export function getDeliveryProgress(
  request: Pick<NextStepShape, 'requestReports'>,
): { delivered: number; total: number } {
  const lines = (request.requestReports ?? []).filter((l) => !isLineRejected(l))
  return {
    delivered: lines.filter((l) => l.status === REQUEST_REPORT_STATUS.DELIVERED)
      .length,
    total: lines.length,
  }
}

export function getNextStep(request: NextStepShape): NextStep {
  switch (request.status) {
    case REQUEST_STATUS.UNDER_REVIEW:
      return { kind: 'review', actionable: false }
    case REQUEST_STATUS.INVOICE_GENERATED:
      return isRequestPayable(request) && request.invoice
        ? {
            kind: 'pay',
            actionable: true,
            amount: request.invoice.amount,
            overdue: request.invoice.status === INVOICE_STATUS.OVERDUE,
          }
        : { kind: 'invoice-pending', actionable: false }
    case REQUEST_STATUS.PAID:
    case REQUEST_STATUS.PROCESSING:
      return {
        kind: 'in-progress',
        actionable: false,
        ...getDeliveryProgress(request),
      }
    case REQUEST_STATUS.COMPLETED:
      return {
        kind: 'download',
        actionable: true,
        delivered: getDeliveryProgress(request).delivered,
      }
    case REQUEST_STATUS.REJECTED:
      return { kind: 'rejected', actionable: false }
    case REQUEST_STATUS.CANCELLED:
      return { kind: 'cancelled', actionable: false }
  }
}

export type RequestGroup =
  'needs-action' | 'in-progress' | 'completed' | 'closed'

/** Tab a Request belongs to in the requests list. Only payment needs action. */
export function getRequestGroup(request: NextStepShape): RequestGroup {
  switch (getNextStep(request).kind) {
    case 'pay':
      return 'needs-action'
    case 'download':
      return 'completed'
    case 'rejected':
    case 'cancelled':
      return 'closed'
    default:
      return 'in-progress'
  }
}
