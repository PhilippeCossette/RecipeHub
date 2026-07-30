import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const signUpSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
})

export type LoginType = z.infer<typeof loginSchema>
export type SignUpType = z.infer<typeof signUpSchema>

export type CurrentUser = {
  id: string
  email: string | null
  username: string | null
  role: null | 'admin'
  created_at: string
} | null
