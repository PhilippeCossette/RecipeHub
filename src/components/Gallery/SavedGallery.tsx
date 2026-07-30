import { Gallery } from '../Gallery'
import { Route as RootRoute } from '#/routes/__root'
import { notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getLikedRecipeQuery } from '#/queries/user'

export default function SavedGallery() {
  const { user } = RootRoute.useRouteContext()

  if (!user) throw notFound()

  const { data } = useSuspenseQuery(getLikedRecipeQuery(user.id))

  return (
    <Gallery type="saved" items={data.recipes} title="Your Saved Recipes" />
  )
}
