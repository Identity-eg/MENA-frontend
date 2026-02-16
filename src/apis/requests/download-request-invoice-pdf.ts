import { apiClient } from '../request/api-client'

/**
 * Download the invoice PDF for a request.
 * Uses GET /api/requests/:requestId/invoice/pdf (authenticated).
 * Triggers a file download in the browser.
 */
export async function downloadRequestInvoicePdf(
  requestId: number,
  filename?: string,
): Promise<void> {
  const response = await apiClient.get(`/requests/${requestId}/invoice/pdf`, {
    responseType: 'blob',
  })
  const blob = response.data as Blob
  const disposition = response.headers['content-disposition']
  const match = disposition?.match(/filename="?([^";\n]+)"?/)
  const suggestedName =
    filename ?? (match ? match[1] : `invoice-request-${requestId}.pdf`)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = suggestedName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
