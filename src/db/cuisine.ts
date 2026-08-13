import { getSupabaseServerClient } from '#/lib/supabase'
import type { Cuisine } from '#/schema/cuisine'
import { createServerFn } from '@tanstack/react-start'

export const getCuisinesFN = createServerFn().handler(
  async (): Promise<Cuisine[]> => {
    const supabase = getSupabaseServerClient()

    const { data: cuisines, error } = await supabase
      .from('cuisines')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }
    console.log('cuisines', cuisines)

    return cuisines
  },
)
