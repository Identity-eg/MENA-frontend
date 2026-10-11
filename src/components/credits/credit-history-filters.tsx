import { useState } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'

import type { CreditHistorySearch } from '@/lib/credit-history'
import type { TCreditTransactionType } from '@/types/credits'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import {
  CREDIT_TRANSACTION_TYPE_LABELS,
} from '@/lib/credit-history'
import {
  CREDIT_TRANSACTION_TYPES,
} from '@/types/credits'

const ALL_TYPES = 'ALL'

const typeItems = [
  { value: ALL_TYPES, label: 'All types' },
  ...CREDIT_TRANSACTION_TYPES.map((type) => ({
    value: type,
    label: CREDIT_TRANSACTION_TYPE_LABELS[type],
  })),
]

function parseLocalDate(d: string | undefined): Date | undefined {
  if (!d) return undefined
  const parsed = new Date(`${d}T00:00:00`)
  return isNaN(parsed.getTime()) ? undefined : parsed
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type CreditHistoryFiltersProps = {
  search: CreditHistorySearch
  /** Called with the new filters; the page always goes back to 1. */
  onChange: (next: CreditHistorySearch) => void
}

/** Type and date-range filters of the Credit history. */
export function CreditHistoryFilters({
  search,
  onChange,
}: CreditHistoryFiltersProps) {
  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)

  const update = (patch: Partial<CreditHistorySearch>) =>
    onChange({ type: search.type, from: search.from, to: search.to, ...patch })
  const filtered = Boolean(search.type || search.from || search.to)

  const fromDate = parseLocalDate(search.from)
  const toDate = parseLocalDate(search.to)

  return (
    <div
      role="group"
      aria-label="Filter Credit history"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,12rem)_minmax(0,11rem)_minmax(0,11rem)_auto] items-start"
    >
      <div className="space-y-1.5">
        <Label htmlFor="credit-history-type">Type</Label>
        <div className="relative flex">
          <Select
            items={typeItems}
            value={search.type ?? ALL_TYPES}
            onValueChange={(value) =>
              update({
                type:
                  value === ALL_TYPES || value == null
                    ? undefined
                    : (value as TCreditTransactionType),
              })
            }
          >
            <SelectTrigger
              id="credit-history-type"
              className="h-11 w-full sm:h-9"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {typeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="credit-history-from">From</Label>
        <div className="relative flex">
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger
              render={
                <Button
                  id="credit-history-from"
                  variant="outline"
                  className={cn(
                    'flex h-11 w-full justify-start text-left font-normal sm:h-9',
                    search.from && 'pr-9',
                    !search.from && 'text-muted-foreground',
                  )}
                />
              }
            >
              <CalendarIcon className="mr-2 size-4" />
              {fromDate ? formatDisplayDate(fromDate) : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto p-0 border-0 bg-transparent shadow-none ring-0"
            >
              <Calendar
                selected={fromDate}
                onSelect={(d) => {
                  update({ from: d ? formatDateISO(d) : undefined })
                  setOpenFrom(false)
                }}
                disabled={toDate ? { after: toDate } : undefined}
              />
            </PopoverContent>
          </Popover>
          {search.from && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-11 w-9 hover:bg-transparent sm:h-9"
              onClick={(e) => {
                e.stopPropagation()
                update({ from: undefined })
              }}
              aria-label="Clear from date"
            >
              <X className="size-4 opacity-50 hover:opacity-100" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="credit-history-to">To</Label>
        <div className="relative flex">
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger
              render={
                <Button
                  id="credit-history-to"
                  variant="outline"
                  className={cn(
                    'flex h-11 w-full justify-start text-left font-normal sm:h-9',
                    search.to && 'pr-9',
                    !search.to && 'text-muted-foreground',
                  )}
                />
              }
            >
              <CalendarIcon className="mr-2 size-4" />
              {toDate ? formatDisplayDate(toDate) : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto p-0 border-0 bg-transparent shadow-none ring-0"
            >
              <Calendar
                selected={toDate}
                onSelect={(d) => {
                  update({ to: d ? formatDateISO(d) : undefined })
                  setOpenTo(false)
                }}
                disabled={fromDate ? { before: fromDate } : undefined}
              />
            </PopoverContent>
          </Popover>
          {search.to && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-11 w-9 hover:bg-transparent sm:h-9"
              onClick={(e) => {
                e.stopPropagation()
                update({ to: undefined })
              }}
              aria-label="Clear to date"
            >
              <X className="size-4 opacity-50 hover:opacity-100" />
            </Button>
          )}
        </div>
      </div>

      {filtered && (
        <Button
          variant="ghost"
          className="h-11 justify-self-start self-end sm:h-9"
          onClick={() => onChange({})}
        >
          <X aria-hidden />
          Clear filters
        </Button>
      )}
    </div>
  )
}
