import { getUserFN } from '#/db/auth'
import { getLikedRecipesFn, getUserLikesFn } from '#/db/user'
import type { CurrentUser } from '#/schema/auth'
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

export const getLikedRecipeQuery = (userId: string) => {
  return queryOptions({
    queryKey: ['likedRecipes', userId],
    queryFn: () => getLikedRecipesFn({ data: { userId } }),
  })
}
