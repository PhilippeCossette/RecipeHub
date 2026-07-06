import type { Recipe } from '#/schema/recipes'
import RecipeCard from './RecipeCard'

type SavedRecipesGridProps = {
  recipes: Recipe[]
}

export default function SavedRecipesGrid({ recipes }: SavedRecipesGridProps) {
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
