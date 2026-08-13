import {
  createRecipeFn,
  deleteRecipeFn,
  getRecipeByIdFN,
  getRecipesFN,
  getRecipeStatsFn,
  saveRecipeFn,
  updateRecipeFn,
  uploadCoverImageFn,
} from '#/db/recipes'
import type {
  GetRecipesOptions,
  Recipe,
  recipeFormSchemaType,
} from '#/schema/recipes'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

type RecipesResponse = {
  recipes: Recipe[]
  count: number
  page: number
  limit: number
  totalPages: number
}

export const getRecipesQuery = (options: GetRecipesOptions = {}) =>
  queryOptions<RecipesResponse>({
    queryKey: ['recipes', options],
    queryFn: () => getRecipesFN({ data: options }),
  })

export const getRecipeBySlugQuery = (recipeSlug: string) =>
  queryOptions<Recipe | null>({
    queryKey: ['recipe', recipeSlug],
    queryFn: () => getRecipeByIdFN({ data: { recipeSlug } }),
  })

export const deleteRecipeMutation = (recipeId: string) =>
  mutationOptions({
    mutationFn: async () => {
      deleteRecipeFn({ data: { recipeId } })
    },
  })

export const createRecipeMutation = () =>
  mutationOptions({
    mutationFn: async (value: recipeFormSchemaType) => {
      let coverImageUrl = value.cover_image_url

      if (value.coverImageFile) {
        const formData = new FormData()
        formData.append('file', value.coverImageFile)

        const uploadResult = await uploadCoverImageFn({
          data: formData,
        })

        coverImageUrl = uploadResult.url
      }

      return createRecipeFn({
        data: {
          title: value.title,
          description: value.description,
          ingredients: value.ingredients,
          steps: value.steps,
          cuisine_id: value.cuisine_id,
          category_id: value.category_id,
          prep_time_minutes: value.prep_time_minutes,
          cook_time_minutes: value.cook_time_minutes,
          servings: value.servings,
          cover_image_url: coverImageUrl,
        },
      })
    },
  })

export const updateRecipeMutation = (id?: string) =>
  mutationOptions({
    mutationFn: async (value: recipeFormSchemaType) => {
      if (!id) {
        throw new Error('Recipe ID is required for updating a recipe')
      }
      let coverImageUrl = value.cover_image_url

      if (value.coverImageFile) {
        const formData = new FormData()
        formData.append('file', value.coverImageFile)
        const uploadResult = await uploadCoverImageFn({
          data: formData,
        })
        coverImageUrl = uploadResult.url
      }

      return updateRecipeFn({
        data: {
          id,
          title: value.title,
          description: value.description,
          ingredients: value.ingredients,
          steps: value.steps,
          category_id: value.category_id,
          cuisine_id: value.cuisine_id,
          prep_time_minutes: value.prep_time_minutes,
          cook_time_minutes: value.cook_time_minutes,
          servings: value.servings,
          cover_image_url: coverImageUrl,
        },
      })
    },
  })

export const getRecipesFromCategoryQuery = ({
  category,
  limit,
}: {
  category: string
  limit: number
}) =>
  queryOptions({
    queryKey: ['recipes', 'category', category],
    queryFn: () => getRecipesFN({ data: { category, limit } }),
  })

export const SaveRecipeMutation = () =>
  mutationOptions({
    mutationFn: (data: {
      userId: string
      recipeId: string
      isLiked: boolean
      recipe?: Recipe
    }) => saveRecipeFn({ data }),
  })

export const getRecipeStatsQuery = (recipeId: string) =>
  queryOptions({
    queryKey: ['recipe-stats', recipeId],
    queryFn: () => getRecipeStatsFn({ data: { recipeId } }),
  })
