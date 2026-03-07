import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCreateRequest } from '@/apis/requests/create-request'

type RequestScreeningPackageButtonProps = {
  companyId?: number
  individualId?: number
  individualName?: string
  selectedReportIds: Array<number>
  disabled?: boolean
  className?: string
}

export function RequestScreeningPackageButton({
  companyId,
  individualId,
  individualName,
  selectedReportIds,
  disabled = false,
  className,
}: RequestScreeningPackageButtonProps) {
  const navigate = useNavigate()
  const createRequest = useCreateRequest()

  const handleClick = () => {
    if (selectedReportIds.length === 0) return
    createRequest.mutate(
      {
        companiesReports: companyId
          ? [{ companyId, reportIds: selectedReportIds }]
          : undefined,
        individualsReports: individualId
          ? [
              {
                individualId,
                reportIds: selectedReportIds,
                fullName: individualName || '',
              },
            ]
          : undefined,
      },
      {
        onSuccess: () => {
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
