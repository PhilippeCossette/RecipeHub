import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TopMenu from '#/components/TopMenu'
import BottomMenu from '#/components/BottomMenu'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { TooltipProvider } from '#/components/ui/tooltip'
import { currentUserQuery } from '#/queries/user'
import { getCategoriesQuery } from '#/queries/category'
import { Toaster } from '#/components/ui/sonner'
import NotFound from '#/components/NotFound'
import { ThemeProvider } from '#/components/Providers/theme-provider'
import { readThemeCookie } from '#/lib/readThemeCookie'
import { getCuisinesQuery } from '#/queries/cuisine'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const theme = await readThemeCookie()

    const user = await context.queryClient.ensureQueryData(currentUserQuery())

    return {
      user,
      theme,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme } = Route.useRouteContext()
  return (
    <html lang="en" className={`${theme}`} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased ">
        <div className="mx-auto flex min-h-screen pb-16 max-w-350 flex-col">
          <ThemeProvider theme={theme}>
            <TooltipProvider>
              <TopMenu />
              {children}
              <Toaster />
              <BottomMenu />

              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />

              <Scripts />
            </TooltipProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
