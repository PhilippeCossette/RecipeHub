import { RecipeForm } from '#/components/Recipes/RecipeForm'
import { Spinner } from '#/components/ui/spinner'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_admin/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="pageLayout">
      <Suspense fallback={<Spinner />}>
        <RecipeForm />
      </Suspense>
    </main>
  )
}
