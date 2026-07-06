import Hero from '#/components/Hero'
import FeatureRecipes from '#/components/Recipes/FeatureRecipes'
import { getRecipesQuery } from '#/queries/recipes'
import { authErrorSchema } from '#/schema/search'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
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
    <main className="page-wrap pageLayout">
      <Hero />
      <button onClick={() => toast.error('manual test')}>Test</button> // add
      this temporarily
      <FeatureRecipes />
    </main>
  )
}
