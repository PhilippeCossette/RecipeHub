import { IconHeart } from '@tabler/icons-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SaveRecipeMutation } from '#/queries/recipes'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

type saveRecipeData = {
  userId: string
  recipeId: string
  isLiked: boolean
}

export default function SaveButton({
  userId,
  recipeId,
  isLiked,
}: saveRecipeData) {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { mutate } = useMutation({
    ...SaveRecipeMutation(),
    onMutate: async (variables) => {
      const queryKey = ['likes', variables.userId]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<string[]>(queryKey) ?? []

      queryClient.setQueryData<string[]>(
        queryKey,
        (old = []) =>
          variables.isLiked
            ? old.filter((id) => id !== variables.recipeId) // was liked -> remove
            : [...old, variables.recipeId], // wasn't liked -> add
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['likes', _vars.userId], context?.previous ?? [])
      toast.error('An error occurred while saving the recipe.')
    },
    onSuccess: (_data, variables) => {
      toast(
        variables.isLiked
          ? 'Recipe unsaved successfully.'
          : 'Recipe saved successfully.',
        {
          action: {
            label: 'Undo',
            onClick: () => {
              mutate({
                ...variables,
                isLiked: !variables.isLiked,
              })
            },
          },
        },
      )
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['likes', variables.userId],
      })

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
          className="rounded-full p-2"
          size="icon-lg"
          onClick={handleSave}
        >
          <IconHeart stroke={2} fill={isLiked ? 'currentColor' : 'none'} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Save</TooltipContent>
    </Tooltip>
  )
}
