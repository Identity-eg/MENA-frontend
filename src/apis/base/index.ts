import qs from 'qs'
import { apiClient } from './api-client'

import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios'

type TOptions = {
  withOrg?: boolean
  onDownloadProgress?: (progress: number) => void
  onUploadProgress?: (progress: number) => void
} & Omit<AxiosRequestConfig, 'onDownloadProgress' | 'onUploadProgress'>

export const request = async <T>({
  data,
  onDownloadProgress,
  onUploadProgress,
  ...options
}: TOptions) => {
  const isFormData = data instanceof FormData

  const config: AxiosRequestConfig = {
    ...options,
    method: options.method ?? 'GET',
    data,
    headers: {
      ...(isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },

    ...(onUploadProgress && {
      onUploadProgress: (event) => onProgress(event, onUploadProgress),
    }),

    ...(onDownloadProgress && {
      onDownloadProgress: (event) => onProgress(event, onDownloadProgress),
    }),

    paramsSerializer: {
      serialize: (params) =>
        qs.stringify(params, {
          allowEmptyArrays: true,
          skipNulls: true,
          arrayFormat: 'repeat',
        }),
    },

    responseType: options.responseType ?? 'json',
  }

  const response = await apiClient(config)
  return response.data as T
}

const onProgress = (
  progressEvent: AxiosProgressEvent,
  cb: (percent: number) => void,
) => {
  const percent = Math.round(
    (progressEvent.loaded * 100) / (progressEvent.total || 1),
  )
  cb(percent)
}
