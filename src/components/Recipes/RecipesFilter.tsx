import { SearchBar } from '../ui/search-bar'
import { useDebouncedCallback } from 'use-debounce'
import CategoryFilterIcon from '../Category/CategoryFilterIcon'
import { SortFilter } from './SortFilter'
import type { GetRecipesOptions } from '#/schema/recipes'
import { Button } from '../ui/button'
import { IconX } from '@tabler/icons-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { IconFilter } from '@tabler/icons-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { useNavigate, useSearch } from '@tanstack/react-router'

type RecipesFilterProps = {
  from: 'recipes' | 'saved'
}

const ROUTE_MAP_SEARCH = {
  recipes: '/recipes/',
  saved: '/_authenticated/saved',
} as const satisfies Record<RecipesFilterProps['from'], string>
const ROUTE_MAP_NAVIGATE = {
  recipes: '/recipes/',
  saved: '/saved',
} as const satisfies Record<RecipesFilterProps['from'], string>

export default function RecipesFilter({ from }: RecipesFilterProps) {
  const search = useSearch({ from: ROUTE_MAP_SEARCH[from] })
  const navigate = useNavigate({ from: ROUTE_MAP_NAVIGATE[from] })

  const updateSearch = useDebouncedCallback((value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        q: value || undefined,
        page: 1,
      }),
    })
  }, 300)

  const handleCategorySelect = (categorySlug: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: categorySlug || undefined,
        page: 1,
      }),
    })
  }

  const handleSortSelect = (sort: GetRecipesOptions['sort']) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sort: sort || undefined,
        page: 1,
      }),
    })
  }

  const handleClearFilters = () => {
    navigate({
      search: () => ({
        page: 1,
        limit: 12,
      }),
    })
  }

  return (
    <>
      {/* Mobile */}
      <div className="flex gap-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <IconFilter stroke={2} />
              Filters
            </Button>
          </SheetTrigger>

          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 p-4">
              <SearchBar
                searchValue={search.q ?? ''}
                updateSearch={updateSearch}
              />
              <CategoryFilterIcon
                onCategorySelect={handleCategorySelect}
                current={search.category}
              />

              <SortFilter
                onSortChange={handleSortSelect}
                current={search.sort}
              />

              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="hidden md:block w-full"
              >
                <IconX stroke={2} />
                Clear filters
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearFilters}
                className=" md:hidden w-full"
              >
                <IconX stroke={2} />
                Clear filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <div className="hidden gap-4 md:flex">
        <SearchBar searchValue={search.q ?? ''} updateSearch={updateSearch} />

        <CategoryFilterIcon
          onCategorySelect={handleCategorySelect}
          current={search.category}
        />

        <SortFilter onSortChange={handleSortSelect} current={search.sort} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={handleClearFilters}>
              <IconX stroke={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Clear Filters</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
