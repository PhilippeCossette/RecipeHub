import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getUserFN } from '../db/auth'

export const Route = createFileRoute('/_admin')({
  component: RouteComponent,

  beforeLoad: async () => {
    const user = await getUserFN()
    if (!user || user.role !== 'admin') {
      throw redirect({
        to: '/',
      })
    }
  },
})

function RouteComponent() {
  return (
    <div>
      Hello "/_admin"! this checks if the user is authenticated and admin
      <Outlet />
    </div>
  )
}
