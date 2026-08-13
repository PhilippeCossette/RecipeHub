import z from 'zod'
import type { Category } from './category'
import type { Cuisine } from './cuisine'

export type Recipe = {
  id: string

  title: string
  slug: string
  description: string | null

  //   Add ingredients type
  ingredients: string[]
  steps: string[]
  category_id: string
  cuisine_id: string
  cuisines: Cuisine | null
  categories: Category | null

  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number | null

  cover_image_url: string | null

  ingredients_search: string | null

  created_at: string
  updated_at: string
}

export const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(2, 'Description is required').max(1000),
  ingredients: z.array(z.string().min(1)).min(1, 'Add at least one ingredient'),
  steps: z.array(z.string().min(1)).min(1, 'Add at least one step'),
  category_id: z.string().min(1, 'Category is required'),
  cuisine_id: z.string().min(1, 'Cuisine is required'),
  prep_time_minutes: z.number().positive().nullable(),
  cook_time_minutes: z.number().positive().nullable(),
  servings: z.number().int().positive().nullable(),
  cover_image_url: z.url().nullable(),
  coverImageFile: z.instanceof(File).nullable(),
})

export const recipeFormSchemaWithId = recipeFormSchema.extend({
  id: z.uuid().optional(),
})

export const updateRecipeValidator = recipeFormSchemaWithId.omit({
  coverImageFile: true,
})

export type recipeFormSchemaType = z.infer<typeof recipeFormSchemaWithId>

export const recipeSubmitSchema = recipeFormSchema.omit({
  coverImageFile: true,
})

export type RecipesResponse = {
  recipes: Recipe[]
  count: number
  page: number
  limit: number
  totalPages: number
}

export const RecipesSearchParams = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  cuisine: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title-asc', 'title-desc']).optional(),
  page: z.coerce.number().min(1).catch(1),
  limit: z.coerce.number().min(1).max(100).catch(12),
})

export type GetRecipesOptions = {
  q?: string
  category?: string
  cuisine?: string
  sort?: 'newest' | 'oldest' | 'title-asc' | 'title-desc'
  page?: number
  limit?: number
}

export const saveRecipeSchema = z.object({
  userId: z.string(),
  recipeId: z.string(),
  isLiked: z.boolean(),
})

export type RecipeStats = {
  like_count: number
}
