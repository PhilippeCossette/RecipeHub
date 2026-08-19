import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const signUpSchema = z
  .object({
    email: z.email(),
    username: z.string().min(3).max(20),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const updateEmailSchema = z.object({
  email: z.email(),
})

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const updateUsernameSchema = z.object({
  username: z.string().min(3).max(20),
})

export type LoginType = z.infer<typeof loginSchema>
export type SignUpType = z.infer<typeof signUpSchema>
export type UpdateEmailType = z.infer<typeof updateEmailSchema>
export type UpdatePasswordType = z.infer<typeof updatePasswordSchema>
export type UpdateUsernameType = z.infer<typeof updateUsernameSchema>

export type CurrentUser = {
  id: string
  email: string | null
  username: string | null
  role: null | 'admin'
  created_at: string
} | null
