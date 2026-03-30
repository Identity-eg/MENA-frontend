import type {
  RequestReport,
  RequestReportItem,
  RequestReportUploadItem,
} from '@/types/request'

export type RequestDetailReportRow = RequestReport & {
  price: number
  upload?: RequestReportUploadItem | null
  reportStatus?: RequestReportItem['status']
  finalPrice?: number | null
}

export type RequestDetailSubjectItem = {
  id: string
  name: string
  type: 'Company' | 'Individual'
  nationality: string
  reports: Array<RequestDetailReportRow>
}
