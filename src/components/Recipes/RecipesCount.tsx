import { Route as RecipesRoute } from '#/routes/recipes'
import { Route as RootRoute } from '#/routes/__root'
import { Route as SavedRoute } from '#/routes/_authenticated/saved'
import { getRecipesQuery } from '#/queries/recipes'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '../ui/spinner'
import { getLikedRecipeQuery } from '#/queries/user'

type Props = {
  countType: 'recipes' | 'saved'
}

export function RecipesCount({ countType = 'recipes' }: Props) {
  if (countType === 'saved') {
    return <SavedRecipesCount />
  }

  if (countType === 'recipes') {
    return <AllRecipesCount />
  }
}

function AllRecipesCount() {
  const search = RecipesRoute.useSearch()

  const { data, isLoading } = useQuery(getRecipesQuery(search))

  if (isLoading) {
    return <Spinner />
  }

  if (data?.count === 0) {
    return
  }

  if (data?.count === 1) {
    return <p className="text-sm text-muted-foreground">1 recipe found</p>
  }

  return (
    <p className="text-sm text-muted-foreground">{data?.count} recipes found</p>
  )
}

const SavedRecipesCount = () => {
  const { user } = RootRoute.useRouteContext()
  if (!user) {
    return null
  }
  const search = SavedRoute.useSearch()

  const { data, isLoading } = useQuery(getLikedRecipeQuery(user.id, search))

  if (isLoading) {
    return <Spinner />
  }

  if (
    data?.count === 0 &&
    search.q === undefined &&
    search.category === undefined &&
    search.sort === undefined
  ) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven't saved any recipes yet
      </p>
    )
  }

  if (data?.count === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No saved recipes match your search
      </p>
    )
  }

  if (data?.count === 1) {
    return (
      <p className="text-sm text-muted-foreground">You have 1 saved recipe</p>
    )
  }

  return (
    <p className="text-sm text-muted-foreground">
      You have {data?.count} saved recipes
    </p>
  )
}
