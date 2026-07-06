import { getUserFN } from '#/db/auth'
import { createMiddleware } from '@tanstack/react-start'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const user = await getUserFN()
    if (!user) {
      throw new Error('Unauthorized')
    }
    return next({ context: { user } })
  },
)
