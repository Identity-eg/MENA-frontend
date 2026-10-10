import { X } from 'lucide-react'

import type {CreditHistorySearch} from '@/lib/credit-history';
import type {TCreditTransactionType} from '@/types/credits';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  CREDIT_TRANSACTION_TYPE_LABELS
  
} from '@/lib/credit-history'
import {
  CREDIT_TRANSACTION_TYPES
  
} from '@/types/credits'

const ALL_TYPES = 'ALL'

const typeItems = [
  { value: ALL_TYPES, label: 'All types' },
  ...CREDIT_TRANSACTION_TYPES.map((type) => ({
    value: type,
    label: CREDIT_TRANSACTION_TYPE_LABELS[type],
  })),
]

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
  const update = (patch: Partial<CreditHistorySearch>) =>
    onChange({ type: search.type, from: search.from, to: search.to, ...patch })
  const filtered = Boolean(search.type || search.from || search.to)

  return (
    <div
      role="group"
      aria-label="Filter Credit history"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,12rem)_minmax(0,11rem)_minmax(0,11rem)_auto] lg:items-end"
    >
      <div className="space-y-1.5">
        <Label htmlFor="credit-history-type">Type</Label>
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
          <SelectContent>
            {typeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="credit-history-from">From</Label>
        <Input
          id="credit-history-from"
          type="date"
          className="h-11 sm:h-9"
          value={search.from ?? ''}
          max={search.to}
          onChange={(e) => update({ from: e.target.value || undefined })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="credit-history-to">To</Label>
        <Input
          id="credit-history-to"
          type="date"
          className="h-11 sm:h-9"
          value={search.to ?? ''}
          min={search.from}
          onChange={(e) => update({ to: e.target.value || undefined })}
        />
      </div>

      {filtered && (
        <Button
          variant="ghost"
          className="h-11 justify-self-start sm:h-9"
          onClick={() => onChange({})}
        >
          <X aria-hidden />
          Clear filters
        </Button>
      )}
    </div>
  )
}
