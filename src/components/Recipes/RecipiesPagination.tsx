import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Route } from '#/routes/recipes'
import { getRecipesQuery } from '#/queries/recipes'
import { useSuspenseQuery } from '@tanstack/react-query'

export function RecipesPagination() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

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
