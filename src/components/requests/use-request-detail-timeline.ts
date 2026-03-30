import { useMemo } from 'react'
import type { RequestStatusValue } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'
import {
  REQUEST_DETAIL_TIMELINE_STATUSES,
  requestDetailStatusConfig,
} from './request-detail-status-config'
import { formatRequestDate } from './request-detail-formatters'

export type RequestDetailTimelineStep = {
  status: RequestStatusValue
  label: string
  date: string
  active: boolean
}

export function useRequestDetailTimeline(
  status: RequestStatusValue,
  createdAt: string,
  updatedAt: string,
): RequestDetailTimelineStep[] {
  const submittedDate = formatRequestDate(createdAt)
  const updatedDate = formatRequestDate(updatedAt)

  return useMemo(() => {
    const currentStepIndex =
      REQUEST_DETAIL_TIMELINE_STATUSES.indexOf(status)
    const isRejectedOrCancelled =
      status === REQUEST_STATUS.REJECTED ||
      status === REQUEST_STATUS.CANCELLED

    return REQUEST_DETAIL_TIMELINE_STATUSES.map((s, idx) => {
      const active = idx <= currentStepIndex
      const date =
        active && !isRejectedOrCancelled
          ? idx === 0
            ? submittedDate
            : updatedDate
          : 'Pending'
      return {
        status: s,
        label: requestDetailStatusConfig[s].label,
        date,
        active: active || (idx === currentStepIndex && isRejectedOrCancelled),
      }
    })
  }, [status, submittedDate, updatedDate])
}
