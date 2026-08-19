import z from 'zod'

export type Cuisine = {
  id: string
  name: string
  slug: string
}

export const cuisineFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export type CuisineFormValues = z.infer<typeof cuisineFormSchema>

export const updateCuisineFormSchema = z.object({
  id: z.string().min(1, { message: 'ID is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
})

export type updateCuisineFormSchema = z.infer<typeof updateCuisineFormSchema>
