import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-3xl p-2 shadow-sm">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Skeleton className="size-full rounded-2xl" />

        {/* Time badge */}
        <Skeleton className="absolute top-3 right-3 h-7 w-16 rounded-full" />
      </div>

      <CardContent className="space-y-3 px-2 pt-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Badges */}
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="px-2 pb-1">
        <Skeleton className="h-11 w-full rounded-full" />
      </CardFooter>
    </Card>
  )
}
