import { RecipesCount } from '#/components/Recipes/RecipesCount'
import RecipesFilter from '#/components/Recipes/RecipesFilter'
import RecipesGrid from '#/components/Recipes/RecipesGrid'
import RecipesGridSkeleton from '#/components/Recipes/RecipesGridSkeleton'
import { RecipesPagination } from '#/components/Recipes/RecipiesPagination'
import { getRecipesQuery } from '#/queries/recipes'
import { getUserLikesQuery } from '#/queries/user'
import { RecipesSearchParams } from '#/schema/recipes'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/recipes/')({
  component: RouteComponent,
  validateSearch: RecipesSearchParams,
  loader: async ({ context, location }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getRecipesQuery(location.search)),
      context.user
        ? context.queryClient.ensureQueryData(
            getUserLikesQuery(context.user.id),
          )
        : Promise.resolve(),
    ])
  },
})

function RouteComponent() {
  return (
    <main className="pageLayout flex-1 space-y-4">
      <header className="mb-10">
        <h1 className="text-4xl md:text-6xl font-bold">Find Your Next Meal</h1>
        <p className="text-sm md:text-md">
          Search, filter, and browse recipes made for every day cooking.
        </p>
      </header>
      <div className="flex items-center justify-between gap-2 md:flex-col-reverse md:items-stretch md:justify-center md:gap-8">
        <RecipesCount countType="recipes" />
        <RecipesFilter from="recipes" />
      </div>
      <Suspense fallback={<RecipesGridSkeleton count={12} />}>
        <RecipesGrid />
        <RecipesPagination type="recipes" />
      </Suspense>
    </main>
  )
}
