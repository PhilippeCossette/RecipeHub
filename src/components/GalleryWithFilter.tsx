import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '#/components/ui/button.tsx'
import type { CarouselApi } from '#/components/ui/carousel.tsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel.tsx'
import { cn } from '#/lib/utils.ts'
import type { Recipe } from '#/schema/recipes'

import RecipeCard, { RecipeCardSeeMore } from './Recipes/RecipeCard'

export interface GalleryProps {
  items?: Recipe[]
  className?: string
  isLoading?: boolean
}

const GalleryWithFilter = ({ items, className }: GalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) {
      return
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  return (
    <section className={cn('mt-10 md:mt-0', className)}>
      <div className=" shrink-0 w-full gap-2 flex justify-between mb-10">
        <h2 className="text-2xl font-bold">Latest Recipes</h2>
        <div className="hidden shrink-0  gap-2 md:flex justify-end ">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollPrev()
            }}
            disabled={!canScrollPrev}
            className="disabled:pointer-events-auto"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollNext()
            }}
            disabled={!canScrollNext}
            className="disabled:pointer-events-auto"
          >
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:mr-[max(0rem,calc(50vw-768px))] ">
            {items?.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-3 lg:max-w-80"
              >
                <RecipeCard recipe={item} />
              </CarouselItem>
            ))}
            <CarouselItem>
              <RecipeCardSeeMore to="/recipes" />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items?.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-primary' : 'bg-primary/20'
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { GalleryWithFilter }
