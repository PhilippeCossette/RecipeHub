import { getCategoriesQuery } from '#/queries/category'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

import { IconX } from '@tabler/icons-react'
import { IconFilter } from '@tabler/icons-react'
import { Separator } from '../ui/separator'

type CategoryFilterIconProps = {
  onCategorySelect?: (categorySlug: string) => void
  current?: string
  dropDownMobile?: boolean
}

export default function CategoryFilter({
  onCategorySelect,
  current,
  dropDownMobile = false,
}: CategoryFilterIconProps) {
  const { data: categories } = useSuspenseQuery(getCategoriesQuery())

  const handleCategorySelect = (categorySlug: string) => {
    if (current === categorySlug) {
      onCategorySelect?.('')
      return
    }
    onCategorySelect?.(categorySlug)
  }

  return (
    <>
      {/* Mobile: horizontal scrollable pill list, no dropdown */}

      <div className={`${dropDownMobile ? 'hidden' : ''} md:hidden`}>
        <Separator />
        <div className="space-y-3 py-3">
          <h4 className="text-sm">Select Category</h4>
          <div className=" flex flex-wrap gap-2  pb-1">
            {categories.map((category) => {
              const isSelected = current === category.slug
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className="shrink-0 rounded-full transition-all"
                  onClick={() => handleCategorySelect(category.slug)}
                >
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop: dropdown */}
      <div className={`${dropDownMobile ? '' : 'hidden'} gap-2 md:flex`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={current ? 'default' : 'outline'}>
              <IconFilter stroke={2} />
              {current
                ? categories.find((c) => c.slug === current)?.name
                : 'Categories'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Select Category</DropdownMenuLabel>
              {categories.map((category) => (
                <DropdownMenuItem
                  className={`${
                    current === category.slug
                      ? 'bg-accent text-accent-foreground data-highlighted:bg-destructive/10 data-highlighted:text-destructive-foreground transition-all'
                      : ''
                  } group flex justify-between`}
                  key={category.id}
                  onClick={() => handleCategorySelect(category.slug)}
                >
                  {category.name}
                  {current === category.slug && (
                    <IconX
                      stroke={2}
                      className="hidden group-hover:block group-hover:text-destructive"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
