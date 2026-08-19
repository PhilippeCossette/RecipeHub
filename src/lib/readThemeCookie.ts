<<<<<<< HEAD
import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

type Theme = 'light' | 'dark'

export const readThemeCookie = createIsomorphicFn()
  .server((): Theme => {
    const cookieTheme = getCookie('theme')
    return cookieTheme === 'dark' ? 'dark' : 'light'
  })
  .client((): Theme => {
    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/)
    return match?.[1] === 'dark' ? 'dark' : 'light'
  })
=======
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const readThemeCookie = createServerFn().handler(
  (): 'light' | 'dark' => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/)
      return match?.[1] === 'dark' ? 'dark' : 'light'
    }

    const cookieTheme = getCookie('theme')
    return cookieTheme === 'dark' ? 'dark' : 'light'
  },
)

// export function readThemeCookie(): 'light' | 'dark' {
//   if (typeof document !== 'undefined') {
//     const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/)
//     return match?.[1] === 'dark' ? 'dark' : 'light'
//   }

//   const cookieTheme = getCookie('theme')
//   return cookieTheme === 'dark' ? 'dark' : 'light'
// }
>>>>>>> 3bb6d15dfc6488b132170e72cd2baec04a367740
