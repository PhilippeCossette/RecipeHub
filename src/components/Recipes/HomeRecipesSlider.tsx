import { useSuspenseQuery } from '@tanstack/react-query'
import { getRecipesQuery } from '#/queries/recipes'
import { GalleryWithFilter } from '#/components/GalleryWithFilter'

export default function HomeRecipesSlider() {
  const { data, isLoading } = useSuspenseQuery(
    getRecipesQuery({
      limit: 10,
    }),
  )

  return (
    <>
      <GalleryWithFilter items={data.recipes} isLoading={isLoading} />
    </>
  )
}
