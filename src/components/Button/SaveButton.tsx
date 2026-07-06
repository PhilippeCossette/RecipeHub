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
    onMutate: async () => {
      const queryKey = ['likes', userId]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<string[]>(queryKey)

      queryClient.setQueryData<string[]>(
        queryKey,
        (old = []) =>
          isLiked
            ? old.filter((id) => id !== recipeId) // was liked -> remove
            : [...old, recipeId], // wasn't liked -> add
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['likes', userId], context?.previous)
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
