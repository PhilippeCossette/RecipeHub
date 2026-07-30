import { createContext, useContext, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
)

const COOKIE_KEY = 'theme'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function setCookie(theme: Theme) {
  document.cookie = `${COOKIE_KEY}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function ThemeProvider({
  children,
  theme: initialTheme,
}: {
  children: React.ReactNode
  /**
   * Theme resolved server-side from the cookie, passed down from
   * the root route's `beforeLoad`/context. This is what makes the
   * very first paint correct with no flicker — no client script needed.
   */
  theme: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  const setTheme = (nextTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(nextTheme)

    setCookie(nextTheme)
    setThemeState(nextTheme)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
