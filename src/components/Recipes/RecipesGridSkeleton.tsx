import RecipeCardSkeleton from './RecipesCardSkeleton'

type Props = {
  count: number
}

export default function RecipesGridSkeleton({ count = 6 }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  )
}
