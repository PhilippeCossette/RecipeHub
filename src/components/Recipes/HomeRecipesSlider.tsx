import { useSuspenseQuery } from '@tanstack/react-query'
import { getRecipesQuery } from '#/queries/recipes'
import { Gallery } from '#/components/Gallery'

export default function HomeRecipesSlider() {
  const { data } = useSuspenseQuery(
    getRecipesQuery({
      limit: 10,
      sort: 'newest',
    }),
  )

  return <Gallery title="Latest Recipes" items={data.recipes} />
}
