import type { RequestStatusValue } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'

/** Aligned with Prisma RequestStatus enum */
export const requestDetailStatusConfig: Record<
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

/** Ordered flow for timeline (Prisma RequestStatus) */
export const REQUEST_DETAIL_TIMELINE_STATUSES: Array<RequestStatusValue> = [
  REQUEST_STATUS.UNDER_REVIEW,
  REQUEST_STATUS.INVOICE_GENERATED,
  REQUEST_STATUS.PAID,
  REQUEST_STATUS.PROCESSING,
  REQUEST_STATUS.COMPLETED,
]
