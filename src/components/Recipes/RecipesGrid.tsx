import { getRecipesQuery } from '#/queries/recipes'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Route } from '#/routes/recipes/index'
import RecipeCard from './RecipeCard'
import NotFound from '../NotFound'

export default function RecipesGrid() {
  const search = Route.useSearch()
  const { data } = useSuspenseQuery(
    getRecipesQuery({
      ...search,
    }),
  )

  if (data.recipes.length === 0) {
    return (
      <NotFound
        title="Still cooking this one up."
        message="No recipes match your search yet — try something else, or check back later."
        type="recipe"
      />
    )
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  )
}
