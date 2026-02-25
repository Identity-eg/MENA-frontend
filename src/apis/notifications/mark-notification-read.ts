import { request } from '../request'

export async function markNotificationRead(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
    })
}
