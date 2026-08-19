import { slugify } from '#/lib/slugify'
import { getSupabaseServerClient } from '#/lib/supabase'
import { adminMiddleware } from '#/middleware/admin'
import {
  cuisineFormSchema,
  updateCuisineFormSchema,
  type Cuisine,
} from '#/schema/cuisine'
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

export const createCuisineFN = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(cuisineFormSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const slug = slugify(data.name)

    const { data: category, error } = await supabase
      .from('cuisines')
      .insert({ name: data.name, slug })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return category
  })

export const deleteCuisineFN = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator((data: { id: string }) => {
    if (!data.id) {
      throw new Error('Cuisine ID is required')
    }

    return data
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: deleted, error } = await supabase
      .from('cuisines')
      .delete()
      .eq('id', data.id)
      .select()

    if (error) throw new Error(error.message)
    if (!deleted || deleted.length === 0) {
      throw new Error('Cuisine not found')
    }

    return { id: data.id }
  })

export const updateCuisineFN = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateCuisineFormSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: updated, error } = await supabase
      .from('cuisines')
      .update({ name: data.name })
      .eq('id', data.id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return updated
  })
