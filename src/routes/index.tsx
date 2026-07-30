import Hero from '#/components/Hero'
import HomeRecipesSlider from '#/components/Recipes/HomeRecipesSlider'
import { RecipeGallerySkeleton } from '#/components/Recipes/RecipeGallerySkeleton'
import { getRecipesQuery } from '#/queries/recipes'
import { authErrorSchema } from '#/schema/search'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipesQuery())
  },
  validateSearch: authErrorSchema,
  component: App,
})

function App() {
  const { authError } = Route.useSearch()
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (authError) {
      queueMicrotask(() => {
        toast.error('You must be logged in to access this page', {
          id: 'authError',
        })
      })
      navigate({ to: '/', search: {}, replace: true })
    }
  }, [authError])
  return (
    <main className="page-wrap pageLayout no-padding">
      <Hero />
      <Suspense fallback={<RecipeGallerySkeleton />}>
        <HomeRecipesSlider />
      </Suspense>
    </main>
  )
}
