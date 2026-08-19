import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '../lib/supabase'
import {
  loginSchema,
  signUpSchema,
  updateEmailSchema,
  updatePasswordSchema,
  type CurrentUser,
} from '#/schema/auth'
import { authMiddleware } from '#/middleware/auth'

export const getUserFN = createServerFn().handler(
  async (): Promise<CurrentUser> => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, role, created_at')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      throw new Error(profileError.message)
    }
    console.log(profile?.role)

    return {
      id: user.id,
      email: user.email ?? null,
      username: profile?.username ?? null,
      role: profile?.role ?? null,
      created_at: profile?.created_at ?? null,
    }
  },
)

export const signUpFN = createServerFn({ method: 'POST' })
  .validator((data) => {
    return signUpSchema.parse(data)
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    })

    if (error) {
      return { success: false as const, message: error.message }
    }

    return {
      success: true as const,
      user: signUpData.user,
    }
  })

export const logInFN = createServerFn({ method: 'POST' })
  .validator((data) => {
    return loginSchema.parse(data)
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: logInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return { success: false as const, message: error.message }
    }
    return {
      success: true as const,
      user: logInData.user,
    }
  })

export const logOutFN = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }

  return {
    success: true,
  }
})

export const updateEmailFN = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data) => updateEmailSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.updateUser({
      email: data.email,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  })

export const updatePasswordFN = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data) => updatePasswordSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  })
