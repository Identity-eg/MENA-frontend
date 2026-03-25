import { request } from '../base'

export async function markNotificationsRead(): Promise<{ success: boolean }> {
  return request<{ success: boolean }>({
    url: '/notifications/read',
    method: 'PATCH',
  })
}
