import { RecipesCount } from '#/components/Recipes/RecipesCount'
import RecipesFilter from '#/components/Recipes/RecipesFilter'
import RecipesGrid from '#/components/Recipes/RecipesGrid'
import RecipesGridSkeleton from '#/components/Recipes/RecipesGridSkeleton'
import { RecipesPagination } from '#/components/Recipes/RecipiesPagination'
import SavedRecipesGrid from '#/components/Recipes/SavedRecipesGrid'
import { getLikedRecipeQuery } from '#/queries/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_authenticated/saved')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getLikedRecipeQuery(context.user.id),
    )
  },
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const { data: recipes = [] } = useQuery(getLikedRecipeQuery(user.id))

  return (
    <main className="pageLayout space-y-4">
      <header className="mb-10">
        <h1 className="text-4xl md:text-6xl font-bold">Find Your Next Meal</h1>
        <p className="text-sm md:text-md">
          Search, filter, and browse recipes made for every day cooking.
        </p>
      </header>
      <div className="flex items-center justify-between gap-2 md:flex-col-reverse md:items-stretch md:justify-center md:gap-8">
        {/* <RecipesCount /> */}
        {/* <RecipesFilter /> */}
      </div>
      <Suspense fallback={<RecipesGridSkeleton count={12} />}>
        <SavedRecipesGrid recipes={recipes} />
        {/* <RecipesPagination /> */}
      </Suspense>
    </main>
  )
}
