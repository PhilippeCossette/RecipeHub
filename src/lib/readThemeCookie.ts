import { getCookie } from '@tanstack/react-start/server'

export function readThemeCookie(): 'light' | 'dark' {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/)
    return match?.[1] === 'dark' ? 'dark' : 'light'
  }

  const cookieTheme = getCookie('theme')
  return cookieTheme === 'dark' ? 'dark' : 'light'
}
