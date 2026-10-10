import { describe, expect, it } from 'vitest'

import {
  formatRelativeTime,
  getNotificationDay,
  getNotificationDisplay,
} from './notification-display'

describe('getNotificationDisplay', () => {
  it('words a status change by the new status', () => {
    expect(
      getNotificationDisplay({
        type: 'request:statusChanged',
        title: 'Request status updated',
        description: 'Request #12: COMPLETED',
      }),
    ).toMatchObject({
      icon: 'completed',
      tone: 'emerald',
      title: 'Request completed',
    })
    expect(
      getNotificationDisplay({
        type: 'request:statusChanged',
        title: 'Request status updated',
        description: 'Request #12: REJECTED',
      }),
    ).toMatchObject({ icon: 'rejected', tone: 'red' })
  })

  it('keeps the stored title for an unrecognised status', () => {
    expect(
      getNotificationDisplay({
        type: 'request:statusChanged',
        title: 'Request status updated',
        description: 'Request #12: SOMETHING_NEW',
      }),
    ).toMatchObject({ icon: 'generic', title: 'Request status updated' })
  })

  it('names the invoice and the uploaded file', () => {
    expect(
      getNotificationDisplay({
        type: 'invoice:created',
        title: 'Invoice created',
        description: 'INV-0042',
      }),
    ).toMatchObject({ icon: 'invoice', description: 'Invoice INV-0042' })
    expect(
      getNotificationDisplay({
        type: 'request-report:uploaded',
        title: 'Report uploaded',
        description: 'File: credit-report.pdf',
      }),
    ).toMatchObject({ icon: 'report', description: 'credit-report.pdf' })
  })

  it('falls back to the stored wording for unknown types', () => {
    expect(
      getNotificationDisplay({
        type: 'something:else',
        title: 'Hello',
        description: 'World',
      }),
    ).toEqual({
      icon: 'generic',
      tone: 'neutral',
      title: 'Hello',
      description: 'World',
    })
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2026-10-10T12:00:00').getTime()

  it('reads naturally', () => {
    expect(formatRelativeTime(now - 10_000, now)).toBe('just now')
    expect(formatRelativeTime(now - 5 * 60_000, now)).toBe('5 minutes ago')
    expect(formatRelativeTime(now - 3 * 3600_000, now)).toBe('3 hours ago')
    expect(formatRelativeTime(now - 24 * 3600_000, now)).toBe('yesterday')
    expect(formatRelativeTime(now - 14 * 24 * 3600_000, now)).toBe(
      '2 weeks ago',
    )
  })
})

describe('getNotificationDay', () => {
  const now = new Date('2026-10-10T12:00:00').getTime()

  it('buckets by local calendar day', () => {
    expect(
      getNotificationDay(new Date('2026-10-10T00:05:00').getTime(), now),
    ).toBe('Today')
    expect(
      getNotificationDay(new Date('2026-10-09T23:55:00').getTime(), now),
    ).toBe('Yesterday')
    expect(
      getNotificationDay(new Date('2026-10-08T23:55:00').getTime(), now),
    ).toBe('Earlier')
  })
})
