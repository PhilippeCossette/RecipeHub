import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '#/components/ui/button.tsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel.tsx'
import { cn } from '#/lib/utils.ts'
import RecipeCardSkeleton from './RecipesCardSkeleton'

type RecipeGallerySkeletonProps = {
  className?: string
  count?: number
}

export const RecipeGallerySkeleton = ({
  className,
  count = 6,
}: RecipeGallerySkeletonProps) => {
  return (
    <section className={cn('', className)}>
      <div className="hidden shrink-0 w-full gap-2 md:flex justify-between mb-10">
        <Skeleton className="h-6 w-32 rounded-full" />
        <div className="hidden shrink-0  gap-2 md:flex justify-end ">
          <Button size="icon" variant="ghost" disabled>
            <ArrowLeft className="size-5" />
          </Button>
          <Button size="icon" variant="ghost" disabled>
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>

      <div className="w-full">
        <Carousel>
          <CarouselContent className="ml-0 2xl:mr-[max(0rem,calc(50vw-768px))]">
            {Array.from({ length: count }).map((_, index) => (
              <CarouselItem
                key={index}
                className="max-w-[320px] pl-3 lg:max-w-80"
              >
                <RecipeCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <Skeleton key={index} className="h-2 w-2 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  )
}
