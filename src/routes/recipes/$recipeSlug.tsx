import RecipeActionDropdown from '#/components/Button/RecipeActionDropdown'
import NotFound from '#/components/NotFound'
import { RecipePage } from '#/components/Recipes/RecipePage'
import { getRecipeBySlugQuery } from '#/queries/recipes'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/$recipeSlug')({
  component: RouteComponent,
  loader: async ({
    context: { queryClient, user },
    params: { recipeSlug },
  }) => {
    const recipe = await queryClient.ensureQueryData(
      getRecipeBySlugQuery(recipeSlug),
    )
    if (!recipe) {
      throw notFound()
    }
    return recipe
  },
  notFoundComponent: () => (
    <NotFound
      title="Recipe not found"
      message="The recipe you are looking for does not exist."
      type="recipe"
    />
  ),
})

function RouteComponent() {
  const { recipeSlug } = Route.useParams()
  const { user } = Route.useRouteContext()
  const { data: recipe } = useSuspenseQuery(getRecipeBySlugQuery(recipeSlug))
  if (!recipe) throw notFound()
  return (
    <main className="pageLayout space-y-4">
      {user?.role === 'admin' && <RecipeActionDropdown recipe={recipe} />}
      <RecipePage recipe={recipe} />
    </main>
  )
}
