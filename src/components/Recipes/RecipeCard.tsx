import { Link, useRouteContext } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconClock, IconUsers } from '@tabler/icons-react'
import type { Recipe } from '#/schema/recipes'
import SaveButton from '../Button/SaveButton'
import { useQuery } from '@tanstack/react-query'
import { getUserLikesQuery } from '#/queries/user'

type RecipeCardProps = {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useRouteContext({
    from: '__root__',
  })
  const { data: likedIds = [] } = useQuery(getUserLikesQuery(user?.id ?? ''))
  const totalTime =
    (recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0)

  const isLiked = likedIds.includes(recipe.id)

  return (
    <Card className=" overflow-hidden rounded-3xl  p-2 shadow-sm">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {recipe.cover_image_url ? (
          <img
            src="https://www.escoffier.edu/wp-content/uploads/2024/12/A-heaping-amount-of-spaghetti-is-topped-with-meatballs-and-a-red-sauce-on-a-brown-plate-with-a-knife-and-fork-to-the-right-of-the-plate.-768.jpg"
            alt={recipe.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {totalTime > 0 && (
          <Badge className="absolute top-3 right-3 rounded-full bg-background/90 text-foreground">
            <IconClock stroke={2} className="size-3.5" />
            {totalTime} min
          </Badge>
        )}
      </div>
      <CardContent className="space-y-2 px-2 pt-3">
        <h3 className="text-lg font-semibold leading-tight">{recipe.title}</h3>

        {recipe.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {recipe.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {recipe.categories && (
            <Badge variant="secondary" className="rounded-full">
              {recipe.categories.name}
            </Badge>
          )}
          {recipe.servings && (
            <Badge variant="secondary" className="rounded-full">
              <IconUsers stroke={2} className="size-3.5" />
              {recipe.servings} servings
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-2 pb-1 flex gap-2">
        <Button asChild className="w-full flex-1 rounded-full" size="lg">
          <Link to={'/'}>View Recipe</Link>
        </Button>
        <SaveButton
          userId={user?.id ?? ''}
          recipeId={recipe.id}
          isLiked={isLiked}
        />
      </CardFooter>
    </Card>
  )
}

type RecipeCardSeeMoreProps = {
  to: string
}

export const RecipeCardSeeMore = ({ to }: RecipeCardSeeMoreProps) => {
  return (
    <Card className="border-none shadow-none text-center flex flex-col justify-center max-w-80 h-full">
      <CardHeader className="flex flex-col items-center justify-center gap-2 py-10">
        <h3 className="text-lg font-semibold leading-tight">
          See More Recipes
        </h3>
        <p className="text-sm text-muted-foreground">
          Explore our full collection of delicious recipes.
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link to={to}>View All Recipes</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
