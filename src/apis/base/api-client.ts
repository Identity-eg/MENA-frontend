import axios from 'axios'

import { getApiBaseUrl } from './api-base-url'
import { requestSuccessInterceptor } from './request-interceptor'
import { responseErrorInterceptor } from './response-interceptor'

/** Request timeout (ms) – prevents infinite loading when backend is unreachable */
const REQUEST_TIMEOUT = 30_000

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(requestSuccessInterceptor, (error) =>
  Promise.reject(error),
)
apiClient.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor,
)
