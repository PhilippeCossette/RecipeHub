import z from 'zod'
import type { Category } from './category'

export type Recipe = {
  id: string

  title: string
  slug: string
  description: string | null

  //   Add ingredients type
  ingredients: string[]
  steps: string[]
  category_id: string
  categories: Category | null

  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number | null

  cover_image_url: string | null

  ingredients_search: string | null

  created_at: string
  updated_at: string
}

export const RecipesSearchParams = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title-asc', 'title-desc']).optional(),
  page: z.coerce.number().min(1).catch(1),
  limit: z.coerce.number().min(1).max(100).catch(12),
})

export type GetRecipesOptions = {
  q?: string
  category?: string
  sort?: 'newest' | 'oldest' | 'title-asc' | 'title-desc'
  page?: number
  limit?: number
}

export const saveRecipeSchema = z.object({
  userId: z.string(),
  recipeId: z.string(),
  isLiked: z.boolean(),
})
