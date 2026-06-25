import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'clarity-theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function applyTheme(theme: Theme): boolean {
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia(MEDIA_QUERY).matches)

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return isDark
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [isDark, setIsDark] = useState(() => applyTheme(getStoredTheme()))

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme)
    setThemeState(newTheme)
    setIsDark(applyTheme(newTheme))
  }, [])

  useEffect(() => {
    setIsDark(applyTheme(theme))
  }, [theme])

  useEffect(() => {
    const mql = window.matchMedia(MEDIA_QUERY)

    const handler = () => {
      if (theme === 'system') {
        setIsDark(applyTheme('system'))
      }
    }

    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  return { theme, setTheme, isDark }
}
