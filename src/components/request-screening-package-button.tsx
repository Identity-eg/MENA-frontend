import { usePostHog } from '@posthog/react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useCreateRequest } from '@/apis/requests/create-request'

type RequestScreeningPackageButtonProps = {
  companyId?: number
  selectedReportIds: Array<number>
  disabled?: boolean
  className?: string
}

export function RequestScreeningPackageButton({
  companyId,
  selectedReportIds,
  disabled = false,
  className,
}: RequestScreeningPackageButtonProps) {
  const navigate = useNavigate()
  const createRequest = useCreateRequest()
  const posthog = usePostHog()

  const handleClick = () => {
    if (selectedReportIds.length === 0) return
    createRequest.mutate(
      {
        companyIds: companyId ? [companyId] : [],
        reportIds: selectedReportIds,
      },
      {
        onSuccess: () => {
          posthog.capture('screening_request_created', {
            selected_report_count: selectedReportIds.length,
            has_company_context: companyId != null,
          })
          navigate({ to: '/requests' })
        },
      },
    )
  }

  const isDisabled =
    disabled || selectedReportIds.length === 0 || createRequest.isPending

  return (
    <Button
      size="lg"
      className={className ?? 'w-full'}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {createRequest.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          Request Screening Package
          <ChevronRight size={16} />
        </>
      )}
    </Button>
  )
}
