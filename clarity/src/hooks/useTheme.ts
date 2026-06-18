import { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'

export function useTheme() {
  const { theme, setTheme } = useAppStore()

  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (theme === 'dark' || (theme === 'system' && prefersDark)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggle = () => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    setTheme(isDark ? 'light' : 'dark')
  }

  return { theme, setTheme, toggle }
}
