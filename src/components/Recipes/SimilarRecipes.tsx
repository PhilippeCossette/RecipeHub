import { useSuspenseQuery } from '@tanstack/react-query'
import { Gallery } from '../Gallery'
import { getRecipesFromCategoryQuery } from '#/queries/recipes'
import NotFound from '../NotFound'

interface SimilarRecipesProps {
  recipeId: string
  categorySlug: string
}

export default function SimilarRecipes({
  categorySlug,
  recipeId,
}: SimilarRecipesProps) {
  const { data } = useSuspenseQuery(
    getRecipesFromCategoryQuery({
      category: categorySlug,
      limit: 10,
    }),
  )

  const similarRecipes = data?.recipes.filter(
    (recipe) => recipe.id !== recipeId,
  )

  if (!similarRecipes || similarRecipes.length === 0) {
    return NotFound({
      title: 'No similar recipes found',
      message: "We couldn't find any similar recipes in this category.",
      type: 'recipe',
      withBackButton: false,
    })
  }

  return <Gallery title="Similar Recipes" items={similarRecipes} />
}
