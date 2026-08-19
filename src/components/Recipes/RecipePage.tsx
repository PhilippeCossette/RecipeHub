import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Clock, ChefHat, Users, UtensilsCrossed } from 'lucide-react'
import { IconX } from '@tabler/icons-react'
import type { Recipe } from '@/schema/recipes'
import { useRecipeChecklist } from '#/hooks/useRecipeChecklist'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import RecipePlaceHolder from '@/assets/images/no-recipe-image.svg?react'

import { useQuery } from '@tanstack/react-query'
import { getRecipeStatsQuery } from '#/queries/recipes'
import SimilarRecipes from './SimilarRecipes'
import { Suspense } from 'react'
import { RecipeGallerySkeleton } from './RecipeGallerySkeleton'

export function RecipePage({ recipe }: { recipe: Recipe }) {
  const {
    ingredients: checkedIngredients,
    steps: checkedSteps,
    toggleIngredient,
    toggleStep,
    reset,
  } = useRecipeChecklist(
    recipe?.id ?? '',
    recipe?.ingredients.length ?? 0,
    recipe?.steps.length ?? 0,
  )

  const { data: recipeStats } = useQuery(getRecipeStatsQuery(recipe.id))

  const totalTime =
    (recipe?.prep_time_minutes ?? 0) + (recipe?.cook_time_minutes ?? 0)

  const showButton = (array: boolean[]) => {
    if (array.some((item) => item === true)) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="flex flex-col gap-8 mx-auto max-w-5xl">
      {/* Hero */}
      <div className="relative h-85 w-full overflow-hidden rounded-xl sm:h-105">
        {recipe?.cover_image_url ? (
          <img
            src={recipe.cover_image_url}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <RecipePlaceHolder className="w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background/50 via-background/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          {recipe?.categories && (
            <Badge className="mb-3 bg-accent text-accent-foreground hover:bg-accent">
              {recipe.categories.name}
            </Badge>
          )}
          {recipeStats && (
            <Badge className="mb-3 bg-accent text-accent-foreground hover:bg-accent">
              {recipeStats.like_count}{' '}
              {recipeStats.like_count <= 1 ? 'like' : 'likes'}
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {recipe?.title}
          </h1>
          {recipe?.description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {recipe.description}
            </p>
          )}
        </div>
      </div>
      {/* Meta info */}
      <div className="mt-6 flex flex-wrap gap-3">
        {recipe?.prep_time_minutes != null && (
          <MetaPill icon={<Clock className="size-4" />} label="Préparation">
            {recipe.prep_time_minutes} min
          </MetaPill>
        )}
        {recipe?.cook_time_minutes != null && (
          <MetaPill icon={<ChefHat className="size-4" />} label="Cuisson">
            {recipe.cook_time_minutes} min
          </MetaPill>
        )}
        {totalTime > 0 && (
          <MetaPill icon={<UtensilsCrossed className="size-4" />} label="Total">
            {totalTime} min
          </MetaPill>
        )}
        {recipe?.servings != null && (
          <MetaPill icon={<Users className="size-4" />} label="Portions">
            {recipe.servings}
          </MetaPill>
        )}
      </div>
      <Separator className="my-8" />
      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <Card className="border-border bg-card  lg:top-6">
            <CardHeader className="h-5 flex justify-between items-center ">
              <h2 className="text-lg font-semibold text-card-foreground">
                Ingrédients
              </h2>
              <ResetButton
                show={showButton(checkedIngredients)}
                onClick={reset}
              />
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe?.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Checkbox
                      id={`ingredient-${i}`}
                      checked={checkedIngredients[i]}
                      onCheckedChange={() => toggleIngredient(i)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`ingredient-${i}`}
                      className="text-sm leading-snug text-foreground"
                    >
                      {ingredient}
                    </label>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Steps */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-cente ">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Préparation
            </h2>
            <ResetButton show={showButton(checkedSteps)} onClick={reset} />
          </div>
          <ol className="space-y-4">
            {recipe?.steps.map((step, i) => (
              <li key={i}>
                <Card className="border-border bg-card">
                  <CardContent className="flex items-start gap-4 py-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-sm leading-relaxed text-foreground">
                      {step}
                    </p>
                    <Checkbox
                      checked={checkedSteps[i]}
                      onCheckedChange={() => toggleStep(i)}
                      className="mt-0.5 shrink-0"
                    />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <Suspense fallback={<RecipeGallerySkeleton />}>
        <SimilarRecipes
          recipeId={recipe?.id ?? ''}
          categorySlug={recipe?.categories?.slug ?? ''}
        />
      </Suspense>
    </div>
  )
}

function MetaPill({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2">
      <span className="text-secondary-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  )
}

const ResetButton = ({
  show,
  onClick,
}: {
  show: boolean
  onClick: () => void
}) => {
  if (!show) return null

  return (
    <Tooltip>
      <TooltipContent>
        <p>Reset Checklists</p>
      </TooltipContent>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive"
          size="icon-sm"
          onClick={onClick}
        >
          <IconX />
        </Button>
      </TooltipTrigger>
    </Tooltip>
  )
}
