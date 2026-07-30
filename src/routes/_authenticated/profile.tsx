import SavedGallery from '#/components/Gallery/SavedGallery'
import ProfileSection from '#/components/Profile/ProfileSection'
import { RecipeGallerySkeleton } from '#/components/Recipes/RecipeGallerySkeleton'
import { Separator } from '#/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="pageLayout space-y-6">
      <ProfileSection />

      <Separator />

      <Suspense fallback={<RecipeGallerySkeleton />}>
        <SavedGallery />
      </Suspense>
    </main>
  )
}
