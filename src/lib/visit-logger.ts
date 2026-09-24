import ip3country from 'ip3country'
import { getRequest, getRequestIP } from '@tanstack/react-start/server'

ip3country.init()

const COUNTRY_HEADERS = [
  'x-country-code',
  'x-geoip-country-code',
  'cf-ipcountry',
]

const getCountryFromHeaders = (headers: Headers) => {
  for (const name of COUNTRY_HEADERS) {
    const value = headers.get(name)
    if (value && value !== 'XX') return value.toUpperCase()
  }
  return null
}

// ip3country only indexes IPv4, so IPv6 callers fall back to the proxy header.
const toIPv4 = (ip: string) => {
  const unmapped = ip.startsWith('::ffff:') ? ip.slice(7) : ip
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(unmapped) ? unmapped : null
}

const getCountry = (headers: Headers, ip: string | undefined) => {
  const fromHeader = getCountryFromHeaders(headers)
  if (fromHeader) return fromHeader

  const ipv4 = ip ? toIPv4(ip) : null
  return ipv4 ? ip3country.lookupStr(ipv4) : null
}

const isPageView = (request: Request) =>
  request.method === 'GET' &&
  (request.headers.get('accept') ?? '').includes('text/html')

export const logVisit = () => {
  const request = getRequest()
  if (!isPageView(request)) return

  const ip = getRequestIP({ xForwardedFor: true })

  console.log(
    JSON.stringify({
      type: 'visit',
      at: new Date().toISOString(),
      path: new URL(request.url).pathname,
      country: getCountry(request.headers, ip),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    }),
  )
}
