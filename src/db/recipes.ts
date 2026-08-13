import { generateUniqueSlug } from '#/lib/slugify'
import { getSupabaseServerClient } from '#/lib/supabase'
import { adminMiddleware } from '#/middleware/admin'
import { authMiddleware } from '#/middleware/auth'
import {
  recipeSubmitSchema,
  saveRecipeSchema,
  updateRecipeValidator,
  type GetRecipesOptions,
  type Recipe,
} from '#/schema/recipes'
import { createServerFn } from '@tanstack/react-start'

export type RecipesResponse = {
  recipes: Recipe[]
  count: number
  page: number
  limit: number
  totalPages: number
}

export const getRecipesFN = createServerFn()
  .validator((data: GetRecipesOptions) => data)
  .handler(async ({ data }): Promise<RecipesResponse> => {
    const supabase = getSupabaseServerClient()

    const page = data.page ?? 1
    const limit = data.limit ?? 10

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase.from('recipes').select(
      `
          *,
          categories!inner (
            id,
            name,
            slug
          ),
          cuisines!inner (
            id,
            name,
            slug
          )
          
        `,
      { count: 'exact' },
    )

    switch (data.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'title-asc':
        query = query.order('title', { ascending: true })
        break
      case 'title-desc':
        query = query.order('title', { ascending: false })
        break
    }

    if (data.category) {
      query = query.eq('categories.slug', data.category)
    }

    if (data.cuisine) {
      query = query.eq('cuisines.slug', data.cuisine)
    }

    if (data.q) {
      query = query.or(
        `title.ilike.%${data.q}%,description.ilike.%${data.q}%,ingredients_search.ilike.%${data.q}%`,
      )
    }

    query = query.range(from, to)

    const { data: recipes, error, count } = await query

    if (error) {
      throw new Error(error.message)
    }
    return {
      recipes,
      count: count ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? 10,
      totalPages: Math.ceil((count || 0) / (data.limit ?? 10)),
    }
  })

export const getRecipeByIdFN = createServerFn()
  .validator((data: { recipeSlug: string }) => data)
  .handler(async ({ data }): Promise<Recipe | null> => {
    const supabase = getSupabaseServerClient()
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select(
        `
          *,
          categories!inner (
            id,
            name,
            slug
          ),
          cuisines!inner (
            id,
            name,
            slug
          )
        `,
      )
      .eq('slug', data.recipeSlug)
      .maybeSingle()
    if (error) {
      throw new Error(error.message)
    }
    return recipe
  })

export const saveRecipeFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(saveRecipeSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    if (data.isLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('recipe_id', data.recipeId)
        .eq('user_id', data.userId)

      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase.from('likes').insert({
        recipe_id: data.recipeId,
        user_id: data.userId,
      })
      if (error) throw new Error(error.message)
    }
  })

export const createRecipeFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(recipeSubmitSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const slug = await generateUniqueSlug(supabase, data.title)
    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert({ ...data, slug })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return recipe
  })

export const deleteRecipeFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator((data: { recipeId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', data.recipeId)
    if (error) throw new Error(error.message)
    return { success: true }
  })

export const updateRecipeFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateRecipeValidator)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const slug = await generateUniqueSlug(supabase, data.title)
    const { data: recipe, error } = await supabase
      .from('recipes')
      .update({ ...data, slug })
      .eq('id', data.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return recipe
  })

export const uploadCoverImageFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    const file = data.get('file') as File | null
    if (!file) {
      throw new Error('No file provided')
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5MB.')
    }

    const supabase = getSupabaseServerClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('cover-images')
      .upload(fileName, file)

    if (uploadError) {
      throw new Error(uploadError.message)
    }
    const {
      data: { publicUrl },
    } = await supabase.storage.from('cover-images').getPublicUrl(fileName)

    return { url: publicUrl }
  })

export const getRecipeStatsFn = createServerFn()
  .validator((data: { recipeId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: stats, error } = await supabase
      .from('recipe_stats')
      .select('*')
      .eq('recipe_id', data.recipeId)
      .single()
    if (error) throw new Error(error.message)
    return stats
  })
