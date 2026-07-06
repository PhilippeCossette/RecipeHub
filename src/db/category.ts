import { getSupabaseServerClient } from '#/lib/supabase'
import type { Category } from '#/schema/category'
import { createServerFn } from '@tanstack/react-start'

export const getCategoriesFN = createServerFn().handler(
  async (): Promise<Category[]> => {
    const supabase = getSupabaseServerClient()

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return categories
  },
)
