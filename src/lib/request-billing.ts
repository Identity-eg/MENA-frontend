import {
  INVOICE_STATUS,
  REQUEST_REPORT_STATUS,
  REQUEST_STATUS,
  type RequestReportItem,
  type TRequest,
  type TRequestInvoice,
} from '@/types/request'

type PayableShape = Pick<TRequest, 'status'> & {
  invoice?: Pick<TRequestInvoice, 'status'> | null
}

/**
 * A request can be paid iff it is INVOICE_GENERATED and its latest invoice is
 * still open (PENDING or OVERDUE). A CANCELLED invoice is withdrawn/voided.
 */
export function isRequestPayable(request: PayableShape): boolean {
  return (
    request.status === REQUEST_STATUS.INVOICE_GENERATED &&
    (request.invoice?.status === INVOICE_STATUS.PENDING ||
      request.invoice?.status === INVOICE_STATUS.OVERDUE)
  )
}

export type InvoiceDisplay =
  /** No invoice yet. */
  | { kind: 'none' }
  /** Open invoice on an INVOICE_GENERATED request: show "Amount due" and Pay. */
  | { kind: 'due'; amount: number; overdue: boolean }
  /** Invoice paid. */
  | { kind: 'paid'; amount: number }
  /** Invoice withdrawn/voided (CANCELLED): never show it as due. */
  | { kind: 'withdrawn' }
  /** Open invoice but the request is no longer awaiting payment (defensive). */
  | { kind: 'issued'; amount: number }

export function getInvoiceDisplay(
  request: Pick<TRequest, 'status' | 'invoice'>,
): InvoiceDisplay {
  const invoice = request.invoice
  if (!invoice) return { kind: 'none' }

  switch (invoice.status) {
    case INVOICE_STATUS.PAID:
      return { kind: 'paid', amount: invoice.amount }
    case INVOICE_STATUS.CANCELLED:
      return { kind: 'withdrawn' }
    default:
      return isRequestPayable(request)
        ? {
            kind: 'due',
            amount: invoice.amount,
            overdue: invoice.status === INVOICE_STATUS.OVERDUE,
          }
        : { kind: 'issued', amount: invoice.amount }
  }
}

/** The invoice PDF is offered for any invoice that was not withdrawn. */
export function canDownloadInvoice(
  request: Pick<TRequest, 'invoice'>,
): boolean {
  return (
    request.invoice != null &&
    request.invoice.status !== INVOICE_STATUS.CANCELLED
  )
}

/** Short text for list/summary cells ("Final price" etc.). */
export function formatInvoiceSummary(
  request: Pick<TRequest, 'status' | 'invoice'>,
): string {
  const display = getInvoiceDisplay(request)
  switch (display.kind) {
    case 'due':
      return `$${display.amount.toLocaleString()} due`
    case 'paid':
      return `$${display.amount.toLocaleString()} paid`
    case 'issued':
      return `$${display.amount.toLocaleString()}`
    case 'withdrawn':
      return 'Invoice withdrawn'
    default:
      return '—'
  }
}

type LinePriceShape = {
  finalPrice?: number | null
  report: { estimatedPrice?: number; price?: number }
}

/** Line price = finalPrice (frozen at invoicing) ?? report.estimatedPrice. */
export function getLinePrice(line: LinePriceShape): number {
  return line.finalPrice ?? line.report.estimatedPrice ?? line.report.price ?? 0
}

/** REJECTED lines are excluded from the total. */
export function isLineRejected(
  line: Pick<RequestReportItem, 'status'>,
): boolean {
  return line.status === REQUEST_REPORT_STATUS.REJECTED
}

/** Rejected after payment: a refund is due (issued manually by the team). */
export function isLineRefundDue(
  line: Pick<RequestReportItem, 'refundDueAt'>,
): boolean {
  return line.refundDueAt != null
}

export function requestHasRefundDue(
  request: Pick<TRequest, 'requestReports'>,
): boolean {
  return (request.requestReports ?? []).some(isLineRefundDue)
}
