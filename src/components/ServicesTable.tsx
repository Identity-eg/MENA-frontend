import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RequestService } from '@/types'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface ServicesTableProps {
  services: RequestService[]
  showDownload?: boolean
  onDownload?: (serviceId: string) => void
  className?: string
}

function serviceStatusBadge(status: RequestService['status']) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="default" className="bg-emerald-100 text-emerald-800">
          Completed
        </Badge>
      )
    case 'included':
      return <Badge variant="secondary">Included</Badge>
    default:
      return <Badge variant="outline">Pending</Badge>
  }
}

export function ServicesTable({
  services,
  showDownload = true,
  onDownload,
  className,
}: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div
        className={cn(
          'rounded-xl border border-border bg-muted/20 px-6 py-8 text-center text-sm text-muted-foreground',
          className,
        )}
      >
        No services in this request.
      </div>
    )
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-sm',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-foreground">
                Service
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground">
                Final TAT
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground">
                Final Price
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground">
                Status
              </th>
              {showDownload && (
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((svc) => (
              <tr key={svc.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium text-foreground">
                  {svc.serviceName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {svc.finalTatDays != null
                    ? `${svc.finalTatDays} days`
                    : 'Pending'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {svc.finalPriceUsd != null
                    ? `$${svc.finalPriceUsd}`
                    : 'Pending'}
                </td>
                <td className="px-4 py-3">{serviceStatusBadge(svc.status)}</td>
                {showDownload && (
                  <td className="px-4 py-3 text-right">
                    {svc.pdfUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const id = svc.serviceId ?? svc.id
                          if (id) onDownload?.(id)
                        }}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
