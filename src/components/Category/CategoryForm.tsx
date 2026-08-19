import { useForm } from '@tanstack/react-form'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/button'
import { categoryFormSchema } from '#/schema/category'
import { createCategoryMutation } from '#/queries/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

type CategoryFormProps = {
  onSuccess: () => void
}

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate: createMutate, isPending } = useMutation({
    ...createCategoryMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      await router.invalidate()
      onSuccess()
      toast.success('Category created successfully!')
    },
    onError: (error) => {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    },
  })

  const form = useForm({
    validators: {
      onSubmit: categoryFormSchema,
    },
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      //   if (isEditMode) {
      //     updateRecipe.mutate(value)
      //     return
      //   }
      //   createRecipe.mutate(value)

      createMutate(value)
    },
  })

  return (
    <form
      className="flex-1 flex-col space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <TextInput
        form={form}
        name="name"
        label="Add a new category"
        type="text"
        validator={categoryFormSchema.shape.name}
        placeholder="Name of the category"
      />
      <Button disabled={isPending}>{isPending ? 'Adding...' : 'Add'}</Button>
    </form>
  )
}
