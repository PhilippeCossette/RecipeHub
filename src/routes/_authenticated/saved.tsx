import NotFound from '#/components/NotFound'
import { RecipesCount } from '#/components/Recipes/RecipesCount'
import RecipesFilter from '#/components/Recipes/RecipesFilter'
import RecipesGrid from '#/components/Recipes/RecipesGrid'
import RecipesGridSkeleton from '#/components/Recipes/RecipesGridSkeleton'
import { RecipesPagination } from '#/components/Recipes/RecipiesPagination'
import SavedRecipesGrid from '#/components/Recipes/SavedRecipesGrid'
import { getLikedRecipeQuery } from '#/queries/user'
import { RecipesSearchParams } from '#/schema/recipes'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_authenticated/saved')({
  component: RouteComponent,
  validateSearch: RecipesSearchParams,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      getLikedRecipeQuery(context.user.id, deps.search),
    )
  },
})

function RouteComponent() {
  const search = Route.useSearch()
  const { user } = Route.useRouteContext()
  const { data } = useSuspenseQuery(
    getLikedRecipeQuery(user.id, {
      ...search,
    }),
  )

  return (
    <main className="pageLayout space-y-4">
      <header className="mb-10">
        <h1 className="text-4xl md:text-6xl font-bold">Saved Recipes</h1>
        <p className="text-sm md:text-md mt-5">
          Your collection of recipes to cook whenever inspiration strikes.
        </p>
      </header>
      <div className="flex items-center justify-between gap-2 md:flex-col-reverse md:items-stretch md:justify-center md:gap-8">
        <RecipesCount countType="saved" />
        <RecipesFilter from="saved" />
      </div>
      <Suspense fallback={<RecipesGridSkeleton count={12} />}>
        <SavedRecipesGrid recipes={data.recipes} />
        <RecipesPagination type="saved" />
      </Suspense>
    </main>
  )
}
