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
