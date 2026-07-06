import z from 'zod'

// This is the search Params type when sending authError
export const authErrorSchema = z.object({
  authError: z.coerce.boolean().optional(),
})
