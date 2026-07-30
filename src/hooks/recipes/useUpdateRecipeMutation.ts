import { updateRecipeMutation } from '#/queries/recipes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export function useUpdateRecipeMutation(
  recipeId?: string,
  recipeSlug?: string,
) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    ...updateRecipeMutation(recipeId),

    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: ['recipes'],
      })

      await router.invalidate()

      toast.success('Recipe updated successfully!')

      router.navigate({
        to: '/recipes/$recipeSlug',
        params: {
          recipeSlug: recipeSlug ?? result.slug,
        },
      })
    },

    onError: (error) => {
      console.error('Error updating recipe:', error)
      toast.error('Failed to update recipe')
    },
  })
}
