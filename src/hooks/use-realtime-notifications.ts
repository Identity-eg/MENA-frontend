import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { NOTIFICATIONS_QUERY_KEY } from './use-notifications-query'
import type { Socket } from 'socket.io-client'
import { getWsUrl } from '@/lib/get-ws-url'
import { useAuthStore } from '@/stores/auth'

const SOCKET_EVENTS = [
  'request:statusChanged',
  'message:new',
  'invoice:created',
  'invoice:updated',
  'request:paid',
  'request-report:uploaded',
] as const

type NotificationPayload = {
  requestId?: number
  message?: {
    id: number
    requestId: number
    content?: string
    sender?: { name: string }
  }
  status?: string
  previousStatus?: string
  invoice?: { id: number; requestId: number; invoiceNumber?: string }
}

function invalidateRequestQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  requestId?: number,
) {
  queryClient.invalidateQueries({ queryKey: ['requests'] })
  queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
  if (requestId != null) {
    queryClient.invalidateQueries({ queryKey: ['request', requestId] })
    queryClient.invalidateQueries({ queryKey: ['messages', requestId] })
  }
}

/**
 * Connects to the backend Socket.IO server and invalidates queries on realtime events.
 * Call once inside a component that has QueryClient (e.g. root or protected layout).
 */
export function useRealtimeNotifications() {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.accessToken)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const wsUrl = getWsUrl()
    if (!wsUrl || !token) return

    const socket = io(wsUrl, {
      path: '/api/socket.io',
      auth: { accessToken: token },
      withCredentials: true,
    })
    socketRef.current = socket

    const onPayload = (
      _event: (typeof SOCKET_EVENTS)[number],
      payload: NotificationPayload,
    ) => {
      invalidateRequestQueries(queryClient, payload.requestId)
    }
    SOCKET_EVENTS.forEach((event) => {
      socket.on(event, (payload: NotificationPayload) =>
        onPayload(event, payload),
      )
    })

    return () => {
      SOCKET_EVENTS.forEach((event) => socket.off(event))
      socket.disconnect()
      socketRef.current = null
    }
  }, [queryClient, token])
}
