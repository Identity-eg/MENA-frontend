import {
  Ban,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  Hourglass,
  Loader,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

import { formatUsd } from '@/lib/request-display'
import type { NextStep } from '@/lib/request-next-step'
import { cn } from '@/lib/utils'

type NextStepCopy = {
  icon: LucideIcon
  /** Short line for list rows and the dashboard. */
  label: string
  /** Fuller sentence for the request page. */
  description: string
  className: string
}

export function getNextStepCopy(step: NextStep): NextStepCopy {
  switch (step.kind) {
    case 'review':
      return {
        icon: Hourglass,
        label: "We're reviewing your request",
        description:
          "We're checking availability and pricing. You'll get an invoice once the review is done.",
        className: 'text-muted-foreground',
      }
    case 'pay':
      return {
        icon: step.overdue ? CircleAlert : CreditCard,
        label: step.overdue
          ? `Pay ${formatUsd(step.amount)} · overdue`
          : `Pay ${formatUsd(step.amount)}`,
        description: step.overdue
          ? 'Your invoice is overdue. Pay it to start work on your reports.'
          : 'Your invoice is ready. Pay it to start work on your reports.',
        className: step.overdue
          ? 'text-red-700 dark:text-red-300'
          : 'text-amber-800 dark:text-amber-300',
      }
    case 'invoice-pending':
      return {
        icon: Hourglass,
        label: "We're preparing a new invoice",
        description:
          'The previous invoice was withdrawn. A new one will appear here shortly.',
        className: 'text-muted-foreground',
      }
    case 'in-progress':
      return {
        icon: Loader,
        label:
          step.total > 0
            ? `In progress · ${step.delivered} of ${step.total} delivered`
            : 'In progress',
        description:
          'Payment received. Our analysts are preparing your reports — each one becomes downloadable as soon as it is delivered.',
        className: 'text-sky-800 dark:text-sky-300',
      }
    case 'download':
      return {
        icon: CheckCircle2,
        label:
          step.delivered === 1
            ? 'Download your report'
            : `Download ${step.delivered} reports`,
        description: 'All reports are delivered and ready to download.',
        className: 'text-emerald-700 dark:text-emerald-300',
      }
    case 'rejected':
      return {
        icon: XCircle,
        label: 'Request rejected',
        description:
          'We could not fulfil this request. Check the messages below for details, or contact us.',
        className: 'text-muted-foreground',
      }
    case 'cancelled':
      return {
        icon: Ban,
        label: 'Request cancelled',
        description:
          'This request was cancelled. Contact us through the messages below if you have questions.',
        className: 'text-muted-foreground',
      }
  }
}

export function RequestNextStepLabel({
  step,
  className,
}: {
  step: NextStep
  className?: string
}) {
  const copy = getNextStepCopy(step)
  const Icon = copy.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium',
        copy.className,
        className,
      )}
    >
      <Icon aria-hidden className="size-4 shrink-0" />
      {copy.label}
    </span>
  )
}
