import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '../request/api-client'

export type RequestReportUploadDownloadResponse = {
  success: boolean
  data: {
    url: string
    expiresIn: number
    fileName: string | null
  }
}

/**
 * Get a presigned download URL for a request report upload.
 * GET /api/request-report-uploads/:id/download (authenticated).
 */
export async function getRequestReportUploadDownloadUrl(
  uploadId: number,
): Promise<{
  success: boolean
  data: RequestReportUploadDownloadResponse['data']
}> {
  const response = await apiClient.get<RequestReportUploadDownloadResponse>(
    `/request-report-uploads/${uploadId}/download`,
  )
  return response.data
}

export const getRequestReportUploadDownloadQueryOptions = (uploadId: number) =>
  queryOptions({
    queryKey: ['request-report-upload-download', uploadId],
    queryFn: () => getRequestReportUploadDownloadUrl(uploadId),
    enabled: false,
    staleTime: 14 * 60 * 1000,
  })

export function useRequestReportUploadDownload() {
  return useMutation({
    mutationFn: (uploadId: number | null) => {
      if (!uploadId) throw new Error('Upload Id is required')
      return getRequestReportUploadDownloadUrl(uploadId)
    },
    onSuccess: ({ data }) => {
      const a = document.createElement('a')
      a.href = data.url
      a.download = data.fileName ?? 'report'
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
  })
}
