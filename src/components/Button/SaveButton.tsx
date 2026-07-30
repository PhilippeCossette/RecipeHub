import { IconHeart } from '@tabler/icons-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SaveRecipeMutation } from '#/queries/recipes'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { Recipe, RecipesResponse } from '#/schema/recipes'

type saveRecipeData = {
  userId: string
  recipeId: string
  isLiked: boolean
  recipe?: Recipe
}

export default function SaveButton({
  userId,
  recipeId,
  recipe,
  isLiked,
}: saveRecipeData) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate } = useMutation({
    ...SaveRecipeMutation(),
    onMutate: async (variables) => {
      const likeKey = ['likes', variables.userId]
      const likedRecipesKeyPrefix = ['likedRecipes', variables.userId]

      await queryClient.cancelQueries({ queryKey: likeKey })
      await queryClient.cancelQueries({ queryKey: likedRecipesKeyPrefix })

      const previousLikes = queryClient.getQueryData<string[]>(likeKey) ?? []

      const previousLikedRecipesEntries =
        queryClient.getQueriesData<RecipesResponse>({
          queryKey: likedRecipesKeyPrefix,
        })

      let removedRecipe: Recipe | undefined
      for (const [, data] of previousLikedRecipesEntries) {
        const found = data?.recipes?.find((r) => r.id === variables.recipeId)
        if (found) {
          removedRecipe = found
          break
        }
      }

      queryClient.setQueryData<string[]>(likeKey, (old = []) =>
        variables.isLiked
          ? old.filter((id) => id !== variables.recipeId)
          : [...old, variables.recipeId],
      )

      queryClient.setQueriesData<RecipesResponse>(
        { queryKey: likedRecipesKeyPrefix },
        (old) => {
          if (!old) return old
          const updatedRecipes = variables.isLiked
            ? old.recipes.filter((recipe) => recipe.id !== variables.recipeId)
            : variables.recipe
              ? [variables.recipe, ...old.recipes]
              : old.recipes

          return {
            ...old,
            recipes: updatedRecipes,
            count: variables.isLiked
              ? old.count - 1
              : variables.recipe
                ? old.count + 1
                : old.count,
          }
        },
      )

      return { previousLikes, previousLikedRecipesEntries, removedRecipe }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['likes', variables.userId],
        context?.previousLikes ?? [],
      )

      context?.previousLikedRecipesEntries?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toast.error(`An error occurred while saving the recipe: ${err.message}`)
    },
    onSuccess: (_data, variables) => {
      toast(
        variables.isLiked
          ? `${recipe?.title} unsaved successfully.`
          : `${recipe?.title} saved successfully.`,
        {
          action: {
            label: 'Undo',
            onClick: () => {
              mutate({
                ...variables,
                isLiked: !variables.isLiked,
                recipe: recipe,
              })
            },
          },
        },
      )
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['likes', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['recipe-stats', recipeId] })
      queryClient.invalidateQueries({
        queryKey: ['likedRecipes', variables.userId],
      })
    },
  })

  const handleSave = () => {
    if (!userId) {
      toast.error('You must be logged in to save recipes.')
      navigate({ to: '/auth' })
      return
    }
    mutate({ userId, recipeId, isLiked })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full p-2 cursor-pointer"
          size="icon-lg"
          onClick={handleSave}
        >
          <IconHeart stroke={2} fill={isLiked ? 'currentColor' : 'none'} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isLiked ? 'Unsave' : 'Save'}</TooltipContent>
    </Tooltip>
  )
}
