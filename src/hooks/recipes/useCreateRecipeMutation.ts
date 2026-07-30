import { createRecipeMutation } from '#/queries/recipes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export function useCreateRecipeMutation(recipeSlug?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    ...createRecipeMutation(),

    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: ['recipes'],
      })

      await router.invalidate()

      toast.success('Recipe created successfully!')

      router.navigate({
        to: '/recipes/$recipeSlug',
        params: {
          recipeSlug: recipeSlug ?? result.slug,
        },
      })
    },

    onError: (error) => {
      console.error('Error creating recipe:', error)
      toast.error('Failed to create recipe')
    },
  })
}
