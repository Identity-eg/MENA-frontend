import type { NotificationsApiItem } from '@/apis/notifications/get-notifications'
import { REQUEST_STATUS } from '@/types/request'

/** Same hue meanings as StatusPill, plus `primary` for conversation. */
export type NotificationTone =
  'neutral' | 'amber' | 'sky' | 'emerald' | 'red' | 'primary'

export type NotificationIcon =
  | 'review'
  | 'invoice'
  | 'invoice-updated'
  | 'paid'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'message'
  | 'report'
  | 'refund'
  | 'request'
  | 'user'
  | 'contact'
  | 'generic'

export type NotificationDisplay = {
  icon: NotificationIcon
  tone: NotificationTone
  title: string
  description?: string
}

const STATUS_DISPLAY: Partial<
  Record<
    string,
    { icon: NotificationIcon; tone: NotificationTone; title: string }
  >
> = {
  [REQUEST_STATUS.UNDER_REVIEW]: {
    icon: 'review',
    tone: 'neutral',
    title: 'Request is under review',
  },
  [REQUEST_STATUS.INVOICE_GENERATED]: {
    icon: 'invoice',
    tone: 'amber',
    title: 'Invoice ready to pay',
  },
  [REQUEST_STATUS.PAID]: {
    icon: 'paid',
    tone: 'sky',
    title: 'Payment confirmed',
  },
  [REQUEST_STATUS.PROCESSING]: {
    icon: 'processing',
    tone: 'sky',
    title: 'Reports are being prepared',
  },
  [REQUEST_STATUS.COMPLETED]: {
    icon: 'completed',
    tone: 'emerald',
    title: 'Request completed',
  },
  [REQUEST_STATUS.REJECTED]: {
    icon: 'rejected',
    tone: 'red',
    title: 'Request rejected',
  },
  [REQUEST_STATUS.CANCELLED]: {
    icon: 'cancelled',
    tone: 'neutral',
    title: 'Request cancelled',
  },
}

/** The backend words a status change as "Request #12: COMPLETED". */
function parseStatus(description?: string) {
  return description?.match(/:\s*([A-Z_]+)\s*$/)?.[1]
}

/**
 * Icon, tone and customer-facing wording for a Notification, keyed off its
 * `type` (the backend's socket event name). Unknown types keep the stored text.
 */
export function getNotificationDisplay(
  n: Pick<NotificationsApiItem, 'type' | 'title' | 'description'>,
): NotificationDisplay {
  switch (n.type) {
    case 'request:statusChanged': {
      const status = STATUS_DISPLAY[parseStatus(n.description) ?? '']
      return status
        ? { ...status }
        : { icon: 'generic', tone: 'neutral', title: n.title }
    }
    case 'invoice:created':
      return {
        icon: 'invoice',
        tone: 'amber',
        title: 'New invoice',
        description: n.description ? `Invoice ${n.description}` : undefined,
      }
    case 'invoice:updated':
      return {
        icon: 'invoice-updated',
        tone: 'amber',
        title: 'Invoice updated',
        description: n.description ? `Invoice ${n.description}` : undefined,
      }
    case 'request:paid':
      return { icon: 'paid', tone: 'emerald', title: 'Payment received' }
    case 'request-report:uploaded':
      return {
        icon: 'report',
        tone: 'emerald',
        title: 'Report ready to download',
        description: n.description?.replace(/^File:\s*/, ''),
      }
    case 'message:new':
      return {
        icon: 'message',
        tone: 'primary',
        title: 'New message',
        description: n.description,
      }
    case 'payment:refundNeeded':
      return {
        icon: 'refund',
        tone: 'red',
        title: n.title,
        description: n.description,
      }
    case 'request:created':
      return { icon: 'request', tone: 'neutral', title: n.title }
    case 'user:created':
      return {
        icon: 'user',
        tone: 'neutral',
        title: n.title,
        description: n.description,
      }
    case 'contact:submitted':
      return {
        icon: 'contact',
        tone: 'neutral',
        title: n.title,
        description: n.description,
      }
    default:
      return {
        icon: 'generic',
        tone: 'neutral',
        title: n.title,
        description: n.description,
      }
  }
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 3600_000],
  ['month', 30 * 24 * 3600_000],
  ['week', 7 * 24 * 3600_000],
  ['day', 24 * 3600_000],
  ['hour', 3600_000],
  ['minute', 60_000],
]

/** "just now", "5 minutes ago", "yesterday", "3 weeks ago". */
export function formatRelativeTime(ts: number, now = Date.now()) {
  const diff = ts - now
  if (Math.abs(diff) < 60_000) return 'just now'
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit)
  }
  return 'just now'
}

export type NotificationDay = 'Today' | 'Yesterday' | 'Earlier'

/** Which day bucket a timestamp falls in, by the viewer's local calendar. */
export function getNotificationDay(
  ts: number,
  now = Date.now(),
): NotificationDay {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const today = startOfToday.getTime()
  if (ts >= today) return 'Today'
  if (ts >= today - 24 * 3600_000) return 'Yesterday'
  return 'Earlier'
}
