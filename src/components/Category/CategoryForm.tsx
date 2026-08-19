import { useForm } from '@tanstack/react-form'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/button'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { categoryFormSchema, type Category } from '#/schema/category'
import {
  createCategoryMutation,
  deleteCategoryMutation,
  getCategoriesQuery,
  updateCategoryMutation,
} from '#/queries/category'
import { DeleteButton } from '../Button/DeleteButton'
import { useState } from 'react'
import {
  CategorySelectionProvider,
  useCategorySelection,
} from '../Providers/category-selection-provider'

type CategoryFormProps = {
  onSuccess: () => void
}

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
  return (
    <CategorySelectionProvider>
      <CategoryManager onSuccess={onSuccess} />
    </CategorySelectionProvider>
  )
}

function CategoryManager({ onSuccess }: CategoryFormProps) {
  const { selectedCategory } = useCategorySelection()
  return (
    <>
      <CategoryFormFields
        key={selectedCategory?.id ?? 'new'}
        onSuccess={onSuccess}
      />
      <CategoryDisplay />
    </>
  )
}

function CategoryFormFields({ onSuccess }: CategoryFormProps) {
  const { selectedCategory, selectCategory } = useCategorySelection()
  const isEditMode = !!selectedCategory
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: createMutate, isPending: isCreating } = useMutation({
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

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    ...updateCategoryMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      await router.invalidate()
      selectCategory(null)
      onSuccess()
      toast.success('Category updated successfully!')
    },
    onError: (error) => {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    },
  })

  const form = useForm({
    validators: { onSubmit: categoryFormSchema },
    defaultValues: { name: selectedCategory?.name ?? '' },
    onSubmit: async ({ value }) => {
      if (isEditMode && selectedCategory) {
        updateMutate({ id: selectedCategory.id, name: value.name })
      } else {
        createMutate(value)
      }
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
        label={isEditMode ? 'Edit category' : 'Add a new category'}
        type="text"
        validator={categoryFormSchema.shape.name}
        placeholder="Name of the category"
      />
      <div className="flex gap-2">
        <Button disabled={isCreating || isUpdating}>
          {isEditMode
            ? isUpdating
              ? 'Saving...'
              : 'Save'
            : isCreating
              ? 'Adding...'
              : 'Add'}
        </Button>
        {isEditMode && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => selectCategory(null)}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export function CategoryDisplay() {
  const { data: categories } = useSuspenseQuery(getCategoriesQuery())
  return (
    <div className="space-y-2">
      {categories?.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}

export function CategoryItem({ category }: { category: Category }) {
  const queryClient = useQueryClient()
  const { selectedCategory, selectCategory } = useCategorySelection()
  const selected = selectedCategory?.id === category.id
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const deleteCategory = useMutation({
    ...deleteCategoryMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(`${category.name} category deleted successfully!`)
    },
    onError: (error) => {
      console.error('Error deleting category:', error)
      toast.error(`Failed to delete ${category.name} category`)
    },
  })

  return (
    <div
      onClick={() => selectCategory(category)}
      className={`border p-2 ${selected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'}`}
    >
      {category.name}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpenDeleteModal(true)}
      >
        Delete
      </Button>
      <DeleteButton
        name={`${category.name} category`}
        handleDeleteClick={() => {
          deleteCategory.mutate({ id: category.id })
        }}
        isDeleting={false}
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
      />
    </div>
  )
}
