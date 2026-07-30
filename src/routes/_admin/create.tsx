import { RecipeForm } from '#/components/Recipes/RecipeForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="pageLayout">
      <RecipeForm />
    </main>
  )
}
