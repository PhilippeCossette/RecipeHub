import type { Recipe } from '#/schema/recipes'
import NotFound from '../NotFound'
import RecipeCard from './RecipeCard'
import { Route as SavedRoute } from '#/routes/_authenticated/saved'

type SavedRecipesGridProps = {
  recipes: Recipe[]
}

export default function SavedRecipesGrid({ recipes }: SavedRecipesGridProps) {
  const search = SavedRoute.useSearch()

  if (
    recipes.length === 0 &&
    search.q === undefined &&
    search.category === undefined &&
    search.sort === undefined &&
    search.cuisine === undefined
  ) {
    return (
      <NotFound
        title="No saved recipes found"
        message="Looks like you haven't saved any recipes yet. Start exploring and save your favorite recipes to see them here."
        type="recipe"
        actionVariants="redirect"
        url="/recipes"
        btnTitle="Explore"
      />
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="h-full">
        <NotFound
          title="Can't find any saved recipes"
          message="No recipes match your search yet — try something else, or check back later."
          type="recipe"
        />
      </div>
    )
  }
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  )
}
