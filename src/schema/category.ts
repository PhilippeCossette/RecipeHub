import z from 'zod'

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
}

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

export const updateCategoryFormSchema = z.object({
  id: z.string().min(1, { message: 'ID is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
})

export type updateCategoryFormSchema = z.infer<typeof updateCategoryFormSchema>
