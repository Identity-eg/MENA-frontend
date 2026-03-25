/**
 * API base URL from env (VITE_API_URL), e.g. https://ident-ity.com/api or http://localhost:5000/api.
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL ?? ''
}
