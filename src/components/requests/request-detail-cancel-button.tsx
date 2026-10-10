import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { getErrorMessage } from '@/apis/base/error-handler'
import { useCancelRequest } from '@/apis/requests/cancel-request'
import { REQUEST_STATUS, type RequestStatusValue } from '@/types/request'

/** The owner may cancel only before payment. */
export const OWNER_CANCELLABLE_STATUSES: ReadonlyArray<RequestStatusValue> = [
  REQUEST_STATUS.UNDER_REVIEW,
  REQUEST_STATUS.INVOICE_GENERATED,
]

type RequestDetailCancelButtonProps = {
  requestId: number
  status: RequestStatusValue
  formattedId: string
}

export function RequestDetailCancelButton({
  requestId,
  status,
  formattedId,
}: RequestDetailCancelButtonProps) {
  const [open, setOpen] = useState(false)
  const { mutate: cancelRequest, isPending } = useCancelRequest()

  const handleConfirm = () => {
    cancelRequest(requestId, {
      onSuccess: () => {
        setOpen(false)
        toast.success(`${formattedId} was cancelled`)
      },
      onError: (error) => {
        setOpen(false)
        toast.error(
          getErrorMessage(error, 'Could not cancel this request.').message,
        )
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => setOpen(next)}>
      <AlertDialogTrigger
        render={
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 text-muted-foreground hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-400/10 dark:hover:text-red-300"
          />
        }
      >
        <XCircle aria-hidden className="h-4 w-4" />
        Cancel request
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel {formattedId}?</AlertDialogTitle>
          <AlertDialogDescription>
            {status === REQUEST_STATUS.INVOICE_GENERATED
              ? 'The open invoice will be withdrawn and this request will not be processed. This cannot be undone.'
              : 'This request will not be processed. This cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Keep request
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Cancel request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
