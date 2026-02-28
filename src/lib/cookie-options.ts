/**
 * Auth cookie options for setCookie (server-only).
 * Use COOKIE_SECURE=true only when the site is served over HTTPS (e.g. after SSL).
 * If you set Secure in production while still on HTTP, the browser will not store
 * or send the cookie and users will be logged out on next request / refresh.
 */
function getAuthCookieOptions(overrides?: { maxAge?: number }) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/' as const,
    ...overrides,
  }
}

export { getAuthCookieOptions }
