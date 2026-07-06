import { Route as RecipesRoute } from '#/routes/recipes'
import { Route as RootRoute } from '#/routes/__root'
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
    return <p className="text-sm text-muted-foreground">No recipes found</p>
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
  const { data, isLoading } = useQuery(getLikedRecipeQuery(user.id))
  const count = data?.length ?? 0

  if (isLoading) {
    return <Spinner />
  }

  if (count === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven't saved any recipes yet
      </p>
    )
  }

  if (count === 1) {
    return (
      <p className="text-sm text-muted-foreground">You have 1 saved recipe</p>
    )
  }

  return (
    <p className="text-sm text-muted-foreground">
      You have {count} saved recipes
    </p>
  )
}
