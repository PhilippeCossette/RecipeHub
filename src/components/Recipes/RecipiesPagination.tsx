import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Route as ExplorerRoute } from '#/routes/recipes'
import { Route as SavedRoute } from '#/routes/_authenticated/saved'
import { Route as RootRoute } from '#/routes/__root'
import { getRecipesQuery } from '#/queries/recipes'
import { useSuspenseQuery } from '@tanstack/react-query'

import { getLikedRecipeQuery } from '#/queries/user'

type RecipesPaginationProps = {
  type: 'recipes' | 'saved'
}

export function RecipesPagination({ type }: RecipesPaginationProps) {
  if (type === 'saved') {
    return <SavedRecipesPagination />
  }

  if (type === 'recipes') {
    return <ExplorerPagination />
  }
}

export function ExplorerPagination() {
  const search = ExplorerRoute.useSearch()
  const navigate = ExplorerRoute.useNavigate()

  const { data } = useSuspenseQuery(getRecipesQuery(search))

  const goToPage = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  if (data.totalPages <= 1) return null

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(data.page - 1)}
            className={
              data.page <= 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {Array.from({ length: data.totalPages }).map((_, index) => {
          const page = index + 1

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === data.page}
                onClick={() => goToPage(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(data.page + 1)}
            className={
              data.page >= data.totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function SavedRecipesPagination() {
  const { user } = RootRoute.useRouteContext()

  if (!user) return null

  const search = SavedRoute.useSearch()
  const navigate = SavedRoute.useNavigate()

  const { data } = useSuspenseQuery(getLikedRecipeQuery(user.id, search))

  const goToPage = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  if (data.totalPages <= 1) return null

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(data.page - 1)}
            className={
              data.page <= 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {Array.from({ length: data.totalPages }).map((_, index) => {
          const page = index + 1

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === data.page}
                onClick={() => goToPage(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(data.page + 1)}
            className={
              data.page >= data.totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
