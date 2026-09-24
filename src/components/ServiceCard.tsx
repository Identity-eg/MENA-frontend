import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Service } from '@/types'
import { Card, CardContent, CardHeader } from './ui/card'

interface ServiceCardProps {
  service: Service
  selected?: boolean
  onToggle?: (id: string) => void
  disabled?: boolean
  showCheckbox?: boolean
  className?: string
}

export function ServiceCard({
  service,
  selected = false,
  onToggle,
  disabled = false,
  showCheckbox = true,
  className,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      onClick={() => showCheckbox && onToggle?.(service.id)}
    >
      <CardHeader className="flex flex-row items-start gap-3 pb-2">
        {showCheckbox && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-input">
            {selected && (
              <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-foreground">{service.name}</div>
          {service.description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {service.description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="font-medium text-foreground">
            Est. ${service.estimatedPriceUsd}
          </span>
          <span className="text-muted-foreground">
            Est. TAT: {service.estimatedTatDays} days
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
