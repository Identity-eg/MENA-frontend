import { createStart } from '@tanstack/react-start'
import { loggingMiddleware } from './middleware/logging-middleware'

export const startInstance = createStart(() => ({
    requestMiddleware: [loggingMiddleware],
}))

export default startInstance
