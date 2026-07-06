import { getRecipesFN, saveRecipeFn } from '#/db/recipes'
import type { GetRecipesOptions, Recipe } from '#/schema/recipes'
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

export const SaveRecipeMutation = () =>
  mutationOptions({
    mutationFn: (data: {
      userId: string
      recipeId: string
      isLiked: boolean
    }) => saveRecipeFn({ data }),
  })
