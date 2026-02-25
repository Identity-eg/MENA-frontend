import { getApiBaseUrl } from '@/apis/request/api-base-url'

/**
 * WebSocket URL for realtime notifications (same host as API, ws/wss).
 */
export function getWsUrl(): string {
  const apiUrl = getApiBaseUrl()
  if (!apiUrl || typeof apiUrl !== 'string') return ''
  try {
    const url = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`
    const o = new URL(url)
    const protocol = o.protocol === 'https:' ? 'wss' : 'ws'
    return `${protocol}://${o.host}`
  } catch {
    return ''
  }
}
