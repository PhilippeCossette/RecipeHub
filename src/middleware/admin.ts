import { getUserFN } from '#/db/auth'
import { createMiddleware } from '@tanstack/react-start'

export const adminMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const user = await getUserFN()
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized')
    }
    return next({ context: { user } })
  },
)
