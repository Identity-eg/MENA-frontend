/// <reference types="vite/client" />

/**
 * Client-side environment variables (VITE_ prefix only).
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_PUBLIC_POSTHOG_PROJECT_TOKEN?: string
  readonly VITE_PUBLIC_POSTHOG_HOST?: string
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
      /** Set to 'true' only when the site is served over HTTPS; otherwise auth cookies are not stored/sent. */
      readonly COOKIE_SECURE?: string
    }
  }
}

export {}
