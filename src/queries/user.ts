import { getUserFN } from '#/db/auth'
import { getUserLikedRecipesFn, getUserLikesFn } from '#/db/user'
import type { CurrentUser } from '#/schema/auth'
import type { GetRecipesOptions } from '#/schema/recipes'
import { queryOptions } from '@tanstack/react-query'

export const currentUserQuery = () =>
  queryOptions<CurrentUser>({
    queryKey: ['currentUser'],
    queryFn: async () => getUserFN(),
  })

export const getUserLikesQuery = (userId: string) => {
  return queryOptions<string[]>({
    queryKey: ['likes', userId],
    queryFn: () => getUserLikesFn({ data: { userId } }),
  })
}

export const getLikedRecipeQuery = (
  userId: string,
  options?: GetRecipesOptions,
) => {
  return queryOptions({
    queryKey: ['likedRecipes', userId, options],
    queryFn: () => getUserLikedRecipesFn({ data: { userId, ...options } }),
  })
}
