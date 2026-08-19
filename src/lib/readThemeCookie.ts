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
