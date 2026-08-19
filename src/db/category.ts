import { slugify } from '#/lib/slugify'
import { getSupabaseServerClient } from '#/lib/supabase'
import { authMiddleware } from '#/middleware/auth'
import { categoryFormSchema, type Category } from '#/schema/category'
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

export const createCategoryFN = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(categoryFormSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const slug = slugify(data.name)

    const { data: category, error } = await supabase
      .from('categories')
      .insert({ name: data.name, slug })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return category
  })
