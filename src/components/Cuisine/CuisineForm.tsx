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
import { cuisineFormSchema, type Cuisine } from '#/schema/cuisine'
import {
  createCuisineMutation,
  deleteCuisineMutation,
  getCuisinesQuery,
  updateCuisineMutation,
} from '#/queries/cuisine'
import { DeleteButton } from '../Button/DeleteButton'
import { useState } from 'react'
import {
  CuisineSelectionProvider,
  useCuisineSelection,
} from '../Providers/cuisine-selection-provider'

type CuisineFormProps = {
  onSuccess: () => void
}

export default function CuisineForm({ onSuccess }: CuisineFormProps) {
  return (
    <CuisineSelectionProvider>
      <CuisineManager onSuccess={onSuccess} />
    </CuisineSelectionProvider>
  )
}

function CuisineManager({ onSuccess }: CuisineFormProps) {
  const { selectedCuisine } = useCuisineSelection()
  return (
    <>
      <CuisineFormFields
        key={selectedCuisine?.id ?? 'new'}
        onSuccess={onSuccess}
      />
      <CuisineDisplay />
    </>
  )
}

function CuisineFormFields({ onSuccess }: CuisineFormProps) {
  const { selectedCuisine, selectCuisine } = useCuisineSelection()
  const isEditMode = !!selectedCuisine
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    ...createCuisineMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cuisines'] })
      await router.invalidate()
      onSuccess()
      toast.success('Cuisine created successfully!')
    },
    onError: (error) => {
      console.error('Error creating cuisine:', error)
      toast.error('Failed to create cuisine')
    },
  })

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    ...updateCuisineMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cuisines'] })
      await router.invalidate()
      selectCuisine(null)
      onSuccess()
      toast.success('Cuisine updated successfully!')
    },
    onError: (error) => {
      console.error('Error updating cuisine:', error)
      toast.error('Failed to update cuisine')
    },
  })

  const form = useForm({
    validators: { onSubmit: cuisineFormSchema },
    defaultValues: { name: selectedCuisine?.name ?? '' },
    onSubmit: async ({ value }) => {
      if (isEditMode && selectedCuisine) {
        updateMutate({ id: selectedCuisine.id, name: value.name })
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
        label={isEditMode ? 'Edit cuisine' : 'Add a new cuisine'}
        type="text"
        validator={cuisineFormSchema.shape.name}
        placeholder="Name of the cuisine"
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
            onClick={() => selectCuisine(null)}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export function CuisineDisplay() {
  const { data: cuisines } = useSuspenseQuery(getCuisinesQuery())
  return (
    <div className="space-y-2">
      {cuisines?.map((cuisine) => (
        <CuisineItem key={cuisine.id} cuisine={cuisine} />
      ))}
    </div>
  )
}

export function CuisineItem({ cuisine }: { cuisine: Cuisine }) {
  const queryClient = useQueryClient()
  const { selectedCuisine, selectCuisine } = useCuisineSelection()
  const selected = selectedCuisine?.id === cuisine.id
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const deleteCuisine = useMutation({
    ...deleteCuisineMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cuisines'] })
      toast.success(`${cuisine.name} cuisine deleted successfully!`)
    },
    onError: (error) => {
      console.error('Error deleting cuisine:', error)
      toast.error(`Failed to delete ${cuisine.name} cuisine`)
    },
  })

  return (
    <div
      onClick={() => selectCuisine(cuisine)}
      className={`border p-2 ${selected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'}`}
    >
      {cuisine.name}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpenDeleteModal(true)}
      >
        Delete
      </Button>
      <DeleteButton
        name={`${cuisine.name} cuisine`}
        handleDeleteClick={() => {
          deleteCuisine.mutate({ id: cuisine.id })
        }}
        isDeleting={false}
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
      />
    </div>
  )
}
