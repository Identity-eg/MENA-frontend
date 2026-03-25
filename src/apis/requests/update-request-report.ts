import { request } from '../base'
import type { RequestReportStatusValue } from '@/types/request'

export type UpdateRequestReportPayload = {
  status?: RequestReportStatusValue
  finalPrice?: number | null
}

export type UpdateRequestReportResponse = {
  success: boolean
  data: unknown
}

/** PATCH /api/request-reports/:id – update one request report (admin). Invalidate request query after. */
export async function updateRequestReport(
  _requestId: number,
  requestReportId: number,
  payload: UpdateRequestReportPayload,
): Promise<UpdateRequestReportResponse> {
  return request<UpdateRequestReportResponse>({
    url: `/request-reports/${requestReportId}`,
    method: 'PATCH',
    data: payload,
  })
}
