import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REQUEST_STATUS, type RequestStatus } from '@/types'

const steps: { key: string; label: string }[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'evaluated', label: 'Evaluated' },
  { key: 'invoice', label: 'Invoice Issued' },
  { key: 'paid', label: 'Paid' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
]

function stepIndexForStatus(status: RequestStatus): number {
  switch (status) {
    case REQUEST_STATUS.UNDER_REVIEW:
      return 0
    case REQUEST_STATUS.INVOICE_GENERATED:
      return 2
    case REQUEST_STATUS.PAID:
      return 3
    case REQUEST_STATUS.PROCESSING:
      return 4
    case REQUEST_STATUS.COMPLETED:
      return 5
    case REQUEST_STATUS.REJECTED:
      return 1
    case REQUEST_STATUS.CANCELLED:
      return 0
    default:
      return 0
  }
}

interface RequestStepperProps {
  status: RequestStatus
  className?: string
}

export function RequestStepper({ status, className }: RequestStepperProps) {
  const currentIndex = stepIndexForStatus(status)

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between gap-1">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex
          const isLast = index === steps.length - 1
          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-gray-200 bg-white text-gray-400',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1.5 text-xs font-medium',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-1 h-0.5 flex-1 min-w-[8px] rounded',
                    index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
