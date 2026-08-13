import { getCuisinesFN } from '#/db/cuisine'
import type { Cuisine } from '#/schema/cuisine'
import { queryOptions } from '@tanstack/react-query'

export const getCuisinesQuery = () =>
  queryOptions<Cuisine[]>({
    queryKey: ['cuisines'],
    queryFn: () => getCuisinesFN(),
  })
