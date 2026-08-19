import {
  createCategoryFN,
  deleteCategoryFN,
  getCategoriesFN,
  updateCategoryFN,
} from '#/db/category'
import type {
  Category,
  CategoryFormValues,
  updateCategoryFormSchema,
} from '#/schema/category'

import { mutationOptions, queryOptions } from '@tanstack/react-query'

export const getCategoriesQuery = () =>
  queryOptions<Category[]>({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFN(),
  })

export const deleteCategoryMutation = () =>
  mutationOptions({
    mutationFn: (data: { id: string }) => deleteCategoryFN({ data }),
  })

export const createCategoryMutation = () =>
  mutationOptions({
    mutationFn: (data: CategoryFormValues) => createCategoryFN({ data }),
  })

export const updateCategoryMutation = () =>
  mutationOptions({
    mutationFn: (data: updateCategoryFormSchema) =>
      updateCategoryFN({ data }),
  })
