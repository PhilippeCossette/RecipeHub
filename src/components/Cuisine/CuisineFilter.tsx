// components/Cuisine/CuisineFilter.tsx
import { getCuisinesQuery } from '#/queries/cuisine'
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

type CuisineFilterProps = {
  onCuisineSelect?: (cuisineSlug: string) => void
  current?: string
  dropDownMobile?: boolean
}

export default function CuisineFilter({
  onCuisineSelect,
  current,
  dropDownMobile = false,
}: CuisineFilterProps) {
  const { data: cuisines } = useSuspenseQuery(getCuisinesQuery())

  const handleCuisineSelect = (cuisineSlug: string) => {
    if (current === cuisineSlug) {
      onCuisineSelect?.('')
      return
    }
    onCuisineSelect?.(cuisineSlug)
  }

  return (
    <>
      {/* Mobile: horizontal scrollable pill list, no dropdown */}

      <div className={`${dropDownMobile ? 'hidden' : ''} md:hidden`}>
        <Separator />
        <div className="space-y-3 py-3">
          <h4 className="text-sm">Select Cuisine</h4>
          <div className=" flex flex-wrap gap-2  pb-1">
            {cuisines.map((cuisine) => {
              const isSelected = current === cuisine.slug
              return (
                <Button
                  key={cuisine.id}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className="shrink-0 rounded-full transition-all"
                  onClick={() => handleCuisineSelect(cuisine.slug)}
                >
                  {cuisine.name}
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
                ? cuisines.find((c) => c.slug === current)?.name
                : 'Cuisines'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Select Cuisine</DropdownMenuLabel>
              {cuisines.map((cuisine) => (
                <DropdownMenuItem
                  className={`${
                    current === cuisine.slug
                      ? 'bg-accent text-accent-foreground data-highlighted:bg-destructive/10 data-highlighted:text-destructive-foreground transition-all'
                      : ''
                  } group flex justify-between`}
                  key={cuisine.id}
                  onClick={() => handleCuisineSelect(cuisine.slug)}
                >
                  {cuisine.name}
                  {current === cuisine.slug && (
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
