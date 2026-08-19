import { getUserFN, updateEmailFN, updatePasswordFN } from '#/db/auth'
import { getUserLikedRecipesFn, getUserLikesFn, updateUsernameFN } from '#/db/user'
import type {
  CurrentUser,
  UpdateEmailType,
  UpdatePasswordType,
  UpdateUsernameType,
} from '#/schema/auth'
import type { GetRecipesOptions } from '#/schema/recipes'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

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

export const updateEmailMutation = () =>
  mutationOptions({
    mutationFn: (data: UpdateEmailType) => updateEmailFN({ data }),
  })

export const updatePasswordMutation = () =>
  mutationOptions({
    mutationFn: (data: UpdatePasswordType) => updatePasswordFN({ data }),
  })

export const updateUsernameMutation = () =>
  mutationOptions({
    mutationFn: (data: UpdateUsernameType) => updateUsernameFN({ data }),
  })
