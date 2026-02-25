import { request } from '../request'

export interface NotificationsApiItem {
  id: string
  type: string
  title: string
  description?: string
  requestId?: number
  createdAt: number
  readAt?: string
}

type GetNotificationsResponse = {
  success: boolean
  data: Array<NotificationsApiItem>
  total: number
  limit: number
  offset: number
}

export async function getNotifications(params?: {
  limit?: number
  offset?: number
}): Promise<GetNotificationsResponse> {
  return request<GetNotificationsResponse>({
    url: '/notifications',
    params: params as Record<string, number | undefined>,
  })
}
