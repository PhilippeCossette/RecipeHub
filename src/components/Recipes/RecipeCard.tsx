import { Link, useRouteContext } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconClock, IconUsers } from '@tabler/icons-react'
import type { Recipe } from '#/schema/recipes'
import SaveButton from '../Button/SaveButton'
import { useQuery } from '@tanstack/react-query'
import { getUserLikesQuery } from '#/queries/user'
import RecipeActionDropdown from '../Button/RecipeActionDropdown'
import RecipePlaceHolder from '@/assets/images/no-recipe-image.svg?react'
import { getRecipeStatsQuery } from '#/queries/recipes'

type RecipeCardProps = {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useRouteContext({
    from: '__root__',
  })
  const { data: recipeStats } = useQuery(getRecipeStatsQuery(recipe.id))
  const { data: likedIds = [] } = useQuery(getUserLikesQuery(user?.id ?? ''))

  const totalTime =
    (recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0)

  const isLiked = likedIds.includes(recipe.id)

  return (
    <Card className="h-full flex-col overflow-hidden rounded-3xl  p-2 shadow-sm">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#fff2a0]">
        {recipe.cover_image_url ? (
          <img
            src={recipe.cover_image_url}
            alt={recipe.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="p-8 flex size-full items-center justify-center text-muted-foreground text-sm">
            <RecipePlaceHolder className="object-contain" />
          </div>
        )}
        <div className="absolute top-0 p-2 flex justify-between w-full">
          {user?.role === 'admin' && <RecipeActionDropdown recipe={recipe} />}

          {totalTime > 0 && (
            <Badge className=" rounded-full bg-background/90 text-foreground">
              <IconClock stroke={2} className="size-3.5" />
              {totalTime} min
            </Badge>
          )}
          <Badge className=" rounded-full bg-background/90 text-foreground">
            {recipeStats?.like_count ?? 0}{' '}
            {recipeStats?.like_count <= 1 ? 'like' : 'likes'}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-1 flex-col space-y-2 px-2 pt-3">
        <h3 className="text-lg font-semibold leading-tight">{recipe.title}</h3>

        {recipe.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {recipe.description}
          </p>
        )}

        <div className=" flex gap-2 pt-1">
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
          <Link
            to={'/recipes/$recipeSlug'}
            params={{ recipeSlug: recipe.slug }}
          >
            View Recipe
          </Link>
        </Button>
        <SaveButton
          userId={user?.id ?? ''}
          recipeId={recipe.id}
          recipe={recipe}
          isLiked={isLiked}
        />
      </CardFooter>
    </Card>
  )
}

type RecipeCardSeeMoreProps = {
  type?: 'saved' | 'default'
  to?: string
}

export const RecipeCardSeeMore = ({
  type = 'default',
  to,
}: RecipeCardSeeMoreProps) => {
  const variants = {
    saved: {
      title: 'See More Saved Recipes',
      description: 'Explore your saved recipes collection.',
      to: '/saved',
    },
    default: {
      title: 'See More Recipes',
      description: 'Explore our full collection of delicious recipes.',
      to: to || '/recipes',
    },
  }

  return (
    <Card className=" border text-center flex flex-col justify-center max-w-80 h-full  shadow-sm">
      <CardHeader className="flex flex-col items-center justify-center gap-2 py-10">
        <h3 className="text-lg font-semibold leading-tight">
          {variants[type].title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {variants[type].description}
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link to={variants[type].to}>View All Recipes</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
