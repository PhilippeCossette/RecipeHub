import { getSupabaseServerClient } from '#/lib/supabase'
import type { GetRecipesOptions } from '#/schema/recipes'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import type { RecipesResponse } from './recipes'

const UserLikesSchema = z.object({
  userId: z.string(),
})

export const getUserLikesFn = createServerFn({ method: 'GET' })
  .validator(UserLikesSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: likedRecipes, error } = await supabase
      .from('likes')
      .select('recipe_id')
      .eq('user_id', data.userId)

    if (error) throw new Error(error.message)
    return likedRecipes.map((row) => row.recipe_id)
  })

type GetLikedRecipesOptions = {
  userId: string
} & GetRecipesOptions

export const getUserLikedRecipesFn = createServerFn()
  .validator((data: GetLikedRecipesOptions) => data)
  .handler(async ({ data }): Promise<RecipesResponse> => {
    const supabase = getSupabaseServerClient()

    const page = data.page || 1
    const limit = data.limit || 10

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase.from('likes').select(
      `
        *,
        recipes!inner (
          *,
          categories!inner (
            id,
            name,
            slug
          )
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
        query = query.order('title', {
          ascending: true,
          referencedTable: 'recipes',
        })
        break
      case 'title-desc':
        query = query.order('title', {
          ascending: false,
          referencedTable: 'recipes',
        })
        break
    }

    if (data.category) {
      query = query.eq('recipes.categories.slug', data.category)
    }

    if (data.q) {
      query = query.or(
        `title.ilike.%${data.q}%,description.ilike.%${data.q}%,ingredients_search.ilike.%${data.q}%`,
        { referencedTable: 'recipes' },
      )
    }

    query = query.range(from, to)

    const { data: likedRecipes, error, count } = await query

    if (error) throw new Error(error.message)

    const recipes = likedRecipes.map((row) => row.recipes)

    return {
      recipes,
      count: count ?? 0,
      page: data.page ?? 1,
      limit: data.limit ?? 10,
      totalPages: Math.ceil((count || 0) / (data.limit ?? 10)),
    }
  })
