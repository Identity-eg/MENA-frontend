import { createMiddleware, createStart } from '@tanstack/react-start'
import { logVisit } from '@/lib/visit-logger'

const visitLoggerMiddleware = createMiddleware().server(({ next }) => {
  logVisit()
  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [visitLoggerMiddleware],
}))
