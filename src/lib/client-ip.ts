import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server'

/**
 * Server-only. Headers that forward the browser's IP to the backend when a
 * server function calls the API on the user's behalf (login, token refresh).
 *
 * The backend rate-limits these endpoints per client IP and only trusts
 * `X-Forwarded-For` from proxies listed in its `TRUST_PROXY` env, which must
 * include this frontend server. Without the header every user would share the
 * frontend server's IP and its limits.
 *
 * The IP comes from `X-Real-IP`, which the nginx in front of this server sets
 * from the connection address on every request, so a browser can't forge it.
 * (The first `X-Forwarded-For` entry can be forged: nginx appends to whatever
 * the browser sent.) Without nginx, e.g. in development, the socket address is used.
 */
export function getClientIpHeaders(): Record<string, string> {
  const clientIp = getRequestHeader('x-real-ip')?.trim() || getRequestIP()
  return clientIp ? { 'X-Forwarded-For': clientIp } : {}
}
