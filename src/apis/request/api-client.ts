import axios from 'axios'

import { responseErrorInterceptor } from './response-interceptor'
import { requestSuccessInterceptor } from './request-interceptor'

const BASE_URL = import.meta.env.VITE_API_URL
console.log('import.meta.env', import.meta.env, BASE_URL)

/** Request timeout (ms) – prevents infinite loading when backend is unreachable */
const REQUEST_TIMEOUT = 30_000

export const apiClient = axios.create({
  baseURL: BASE_URL,
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
