// hooks/use-delete-recipe.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { deleteRecipeMutation } from '#/queries/recipes'

export function useDeleteRecipe(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    ...deleteRecipeMutation(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] })
      await router.invalidate()
      toast.success('Recipe deleted successfully')
      router.navigate({
        to: '/recipes',
        search: { page: '1', limit: '10' },
      })
    },
    onError: (error) => {
      console.error('Error deleting recipe:', error)
      toast.error('Failed to delete recipe')
    },
  })
}
