import { Suspense } from 'react'
import HomeRecipesSlider from './HomeRecipesSlider'
import { RecipeGallerySkeleton } from './RecipeGallerySkeleton'

export default function FeatureRecipes() {
  return (
    <section>
      <Suspense fallback={<RecipeGallerySkeleton />}>
        <HomeRecipesSlider />
      </Suspense>
    </section>
  )
}
