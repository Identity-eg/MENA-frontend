import { Link } from '@tanstack/react-router'
import {
  Ban,
  Bell,
  BellOff,
  CheckCheck,
  CircleCheck,
  CircleX,
  Clock,
  CreditCard,
  FileDown,
  FilePen,
  FilePlus,
  Inbox,
  Mail,
  MessageSquare,
  Receipt,
  RefreshCw,
  RotateCcw,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import type { NotificationsApiItem } from '@/apis/notifications/get-notifications'
import {
  useMarkNotificationReadMutation,
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
} from '@/hooks/use-notifications-query'
import {
  formatRelativeTime,
  getNotificationDay,
  getNotificationDisplay,
  type NotificationDay,
  type NotificationIcon,
  type NotificationTone,
} from '@/lib/notification-display'
import { formatRequestId } from '@/lib/request-display'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '../ui/popover'

const ICONS: Record<NotificationIcon, LucideIcon> = {
  review: Clock,
  invoice: Receipt,
  'invoice-updated': FilePen,
  paid: CreditCard,
  processing: RefreshCw,
  completed: CircleCheck,
  rejected: CircleX,
  cancelled: Ban,
  message: MessageSquare,
  report: FileDown,
  refund: RotateCcw,
  request: FilePlus,
  user: UserPlus,
  contact: Mail,
  generic: Bell,
}

const TONES: Record<NotificationTone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
  emerald:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300',
  primary: 'bg-primary/10 text-primary',
}

const DAYS: Array<NotificationDay> = ['Today', 'Yesterday', 'Earlier']

type Filter = 'all' | 'unread'

/** Re-renders every minute while `active`, so relative times stay fresh. */
function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [active])
  return now
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const now = useNow(open)

  const { data, isLoading } = useNotificationsQuery()
  const markAllRead = useMarkNotificationsReadMutation()
  const markItemRead = useMarkNotificationReadMutation()

  const items = data?.data ?? []
  const unreadCount = items.filter((n) => !n.readAt).length
  const visible = filter === 'unread' ? items.filter((n) => !n.readAt) : items

  const grouped = DAYS.map((day) => ({
    day,
    items: visible.filter((n) => getNotificationDay(n.createdAt, now) === day),
  })).filter((g) => g.items.length > 0)

  const onSelect = (n: NotificationsApiItem) => {
    if (!n.readAt) markItemRead.mutate(n.id)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : 'Notifications'
            }
          />
        }
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-none font-semibold text-white tabular-nums ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="flex max-h-[min(36rem,var(--available-height))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 pt-3.5 pb-3">
          <div className="flex items-baseline gap-2">
            <PopoverTitle>Notifications</PopoverTitle>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {unreadCount} unread
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending || unreadCount === 0}
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </Button>
        </div>

        <div
          role="group"
          aria-label="Filter notifications"
          className="flex gap-1 border-b px-3 py-2"
        >
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
                filter === f
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f === 'all' ? 'All' : 'Unread'}
              {f === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 tabular-nums">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <NotificationSkeleton />
          ) : grouped.length === 0 ? (
            <EmptyState unreadOnly={filter === 'unread' && items.length > 0} />
          ) : (
            grouped.map((group) => (
              <section key={group.day} aria-label={group.day}>
                <h3 className="sticky top-0 z-10 bg-popover/95 px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground backdrop-blur">
                  {group.day}
                </h3>
                <ul className="px-1.5 pb-1.5">
                  {group.items.map((n) => (
                    <NotificationRow
                      key={n.id}
                      notification={n}
                      now={now}
                      onSelect={() => onSelect(n)}
                    />
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationRow({
  notification: n,
  now,
  onSelect,
}: {
  notification: NotificationsApiItem
  now: number
  onSelect: () => void
}) {
  const display = getNotificationDisplay(n)
  const Icon = ICONS[display.icon]
  const unread = !n.readAt

  return (
    <li>
      <Link
        to={n.requestId != null ? '/requests/$requestId' : '/requests'}
        params={
          n.requestId != null ? { requestId: String(n.requestId) } : undefined
        }
        onClick={onSelect}
        className="group relative flex gap-3 rounded-lg px-2.5 py-2.5 transition-colors outline-none hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          aria-hidden
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg',
            TONES[display.tone],
          )}
        >
          <Icon className="size-4.5" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-start justify-between gap-2">
            <span
              className={cn(
                'text-sm leading-snug',
                unread
                  ? 'font-semibold text-foreground'
                  : 'font-medium text-foreground/80',
              )}
            >
              {display.title}
            </span>
            {unread && (
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary">
                <span className="sr-only">Unread</span>
              </span>
            )}
          </span>
          {display.description && (
            <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {display.description}
            </span>
          )}
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            {n.requestId != null && (
              <>
                <span className="tabular-nums">
                  {formatRequestId(n.requestId)}
                </span>
                <span aria-hidden>·</span>
              </>
            )}
            <time
              dateTime={new Date(n.createdAt).toISOString()}
              title={new Date(n.createdAt).toLocaleString()}
            >
              {formatRelativeTime(n.createdAt, now)}
            </time>
          </span>
        </span>
      </Link>
    </li>
  )
}

function NotificationSkeleton() {
  return (
    <div
      aria-busy
      aria-label="Loading notifications"
      className="space-y-1 p-1.5"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3 px-2.5 py-2.5">
          <div className="size-9 shrink-0 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2 pt-0.5">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ unreadOnly }: { unreadOnly: boolean }) {
  const Icon = unreadOnly ? Inbox : BellOff
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon aria-hidden className="size-5" />
      </span>
      <p className="mt-3 text-sm font-medium">
        {unreadOnly ? "You're all caught up" : 'No notifications yet'}
      </p>
      <p className="mt-1 max-w-56 text-xs text-muted-foreground">
        {unreadOnly
          ? 'Nothing new since you last checked.'
          : "We'll let you know when an invoice is ready, a report is delivered, or someone messages you."}
      </p>
    </div>
  )
}
