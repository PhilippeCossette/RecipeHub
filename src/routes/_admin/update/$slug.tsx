import { RecipeForm } from '#/components/Recipes/RecipeForm'
import { getRecipeBySlugQuery } from '#/queries/recipes'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/update/$slug')({
  loader: async ({ context, params }) => {
    const recipe = await context.queryClient.ensureQueryData(
      getRecipeBySlugQuery(params.slug),
    )

    if (!recipe) {
      throw notFound()
    }

    return recipe
  },
  notFoundComponent: () => <div className="mt-20">404 Not Found</div>,
  component: RouteComponent,
})

function RouteComponent() {
  const recipe = Route.useLoaderData()
  return (
    <main className="pageLayout">
      <RecipeForm recipe={recipe} />
    </main>
  )
}
