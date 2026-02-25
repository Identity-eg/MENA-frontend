import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications } from '@/apis/notifications/get-notifications'
import { markNotificationsRead } from '@/apis/notifications/mark-notifications-read'
import { markNotificationRead } from '@/apis/notifications/mark-notification-read'

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

const DEFAULT_PARAMS = { limit: 20, offset: 0 }

export function useNotificationsQuery(params = DEFAULT_PARAMS) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params.limit, params.offset],
    queryFn: () => getNotifications(params),
    staleTime: 30 * 1000,
  })
}

export function useMarkNotificationsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}
