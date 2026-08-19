import { slugify } from '#/lib/slugify'
import { getSupabaseServerClient } from '#/lib/supabase'
import { adminMiddleware } from '#/middleware/admin'
import {
  categoryFormSchema,
  updateCategoryFormSchema,
  type Category,
} from '#/schema/category'
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
  .middleware([adminMiddleware])
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

export const deleteCategoryFN = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator((data: { id: string }) => {
    if (!data.id) {
      throw new Error('Category ID is required')
    }

    return data
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: deleted, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', data.id)
      .select()

    if (error) throw new Error(error.message)
    if (!deleted || deleted.length === 0) {
      throw new Error('Category not found')
    }

    return { id: data.id }
  })

export const updateCategoryFN = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateCategoryFormSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: updated, error } = await supabase
      .from('categories')
      .update({ name: data.name })
      .eq('id', data.id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return updated
  })
