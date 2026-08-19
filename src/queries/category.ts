import { createCategoryFN, getCategoriesFN } from '#/db/category'
import type { Category } from '#/schema/category'
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { type CategoryFormValues } from '#/schema/category'

export const getCategoriesQuery = () =>
  queryOptions<Category[]>({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFN(),
  })

export const createCategoryMutation = () =>
  mutationOptions({
    mutationFn: (data: CategoryFormValues) => createCategoryFN({ data }),
  })
