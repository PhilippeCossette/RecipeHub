import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { IconDotsVerticalFilled } from '@tabler/icons-react'
import { DeleteButton } from './DeleteButton'
import type { Recipe } from '#/schema/recipes'
import { useDeleteRecipe } from '#/hooks/recipes/useDeleteRecipes'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

type Props = {
  recipe: Recipe
}

export default function RecipeActionDropdown({ recipe }: Props) {
  const deleteRecipeMutation = useDeleteRecipe(recipe.id)

  const [open, setOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="p-1">
            <IconDotsVerticalFilled stroke={3} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link to={'/update/$slug'} params={{ slug: recipe.slug }}>
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()

              setTimeout(() => setOpen(true), 0)
            }}
            variant="destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteButton
        name={recipe.title}
        handleDeleteClick={() => deleteRecipeMutation.mutate()}
        isDeleting={deleteRecipeMutation.isPending}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
