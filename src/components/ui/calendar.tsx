import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CalendarProps = {
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: {
    before?: Date
    after?: Date
  }
  className?: string
  initialMonth?: Date
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function startOfDay(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function endOfDay(d: Date) {
  const copy = new Date(d)
  copy.setHours(23, 59, 59, 999)
  return copy
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  className,
  initialMonth,
}: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(
    () => selected ?? initialMonth ?? new Date(),
  )

  React.useEffect(() => {
    if (selected) {
      setViewDate(new Date(selected.getFullYear(), selected.getMonth(), 1))
    }
  }, [selected])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days: { date: Date; isCurrentMonth: boolean }[] = []

  // Prev month filler
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    })
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }

  // Next month filler to complete the 7-column grid
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }
  }

  const today = new Date()

  return (
    <div
      className={cn(
        'p-3 bg-card rounded-xl text-card-foreground shadow-sm ring-1 ring-border/70',
        className,
      )}
    >
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
          onClick={prevMonth}
          aria-label="Previous month"
          type="button"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
          onClick={nextMonth}
          aria-label="Next month"
          type="button"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span
            key={d}
            className="text-xs font-medium text-muted-foreground size-8 flex items-center justify-center"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map(({ date, isCurrentMonth }) => {
          const isSelected = selected ? isSameDay(date, selected) : false
          const isToday = isSameDay(date, today)

          let isDisabled = false
          if (disabled?.before && date < startOfDay(disabled.before)) {
            isDisabled = true
          }
          if (disabled?.after && date > endOfDay(disabled.after)) {
            isDisabled = true
          }

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect?.(date)}
              className={cn(
                'size-8 text-xs rounded-lg transition-colors flex items-center justify-center select-none',
                isSelected &&
                  'bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90',
                !isSelected &&
                  isToday &&
                  'border border-primary/40 font-medium',
                !isSelected &&
                  isCurrentMonth &&
                  !isDisabled &&
                  'hover:bg-muted text-foreground',
                !isSelected &&
                  !isCurrentMonth &&
                  !isDisabled &&
                  'text-muted-foreground/40 hover:bg-muted/50',
                isDisabled &&
                  'text-muted-foreground/30 opacity-40 cursor-not-allowed pointer-events-none',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
