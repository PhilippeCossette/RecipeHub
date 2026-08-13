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
