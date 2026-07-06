import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: '/',
        search: { authError: true },
      })
    }
    return { user: context.user }
  },
})

function RouteComponent() {
  return <Outlet />
}
