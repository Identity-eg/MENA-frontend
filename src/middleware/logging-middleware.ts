import { createMiddleware } from '@tanstack/react-start'
import { logger } from '../lib/logger'

export const loggingMiddleware = createMiddleware().server(
    async (options) => {
        const { next, request } = options;
        const url = new URL(request.url)
        const method = request.method
        const timestamp = new Date().toISOString()

        logger.info({
            msg: 'Incoming Request',
            method,
            url: url.pathname + url.search,
            timestamp,
        })

        return next()
    },
)
