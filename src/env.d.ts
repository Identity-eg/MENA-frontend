/// <reference types="vite/client" />

/**
 * Client-side environment variables (VITE_ prefix only).
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Server-side environment variables (no VITE_ prefix; never exposed to client).
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test'
      /** Backend API base URL for SSR/server-only calls (e.g. http://backend:5000/api). */
      readonly API_SERVER_URL?: string
    }
  }
}

export {}
