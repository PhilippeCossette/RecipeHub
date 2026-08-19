import {
  createCuisineFN,
  deleteCuisineFN,
  getCuisinesFN,
  updateCuisineFN,
} from '#/db/cuisine'
import type {
  Cuisine,
  CuisineFormValues,
  updateCuisineFormSchema,
} from '#/schema/cuisine'

import { mutationOptions, queryOptions } from '@tanstack/react-query'

export const getCuisinesQuery = () =>
  queryOptions<Cuisine[]>({
    queryKey: ['cuisines'],
    queryFn: () => getCuisinesFN(),
  })

export const deleteCuisineMutation = () =>
  mutationOptions({
    mutationFn: (data: { id: string }) => deleteCuisineFN({ data }),
  })

export const createCuisineMutation = () =>
  mutationOptions({
    mutationFn: (data: CuisineFormValues) => createCuisineFN({ data }),
  })

export const updateCuisineMutation = () =>
  mutationOptions({
    mutationFn: (data: updateCuisineFormSchema) => updateCuisineFN({ data }),
  })
