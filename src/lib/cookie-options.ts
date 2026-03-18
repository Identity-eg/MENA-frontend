const ACCESS_TOKEN_EXPIRY = 10 * 60 // 10 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7 // 7 days in seconds

const isProduction = process.env.NODE_ENV === 'production'
const SHARED_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/' as const,
  domain: isProduction ? '.ident-ity.com' : undefined,
}

/**
 * Auth cookie options for setCookie (server-only).
 * Use COOKIE_SECURE=true only when the site is served over HTTPS (e.g. after SSL).
 * If you set Secure in production while still on HTTP, the browser will not store
 * or send the cookie and users will be logged out on next request / refresh.
 */
function getAuthCookieOptions() {
  return {
    accessCookieOptions: {
      ...SHARED_COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRY,
    } as any,
    refreshCookieOptions: {
      ...SHARED_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRY,
    } as any,
  }
}

export { getAuthCookieOptions }
