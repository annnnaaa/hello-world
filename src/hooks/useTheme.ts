import { useState, useEffect, useCallback } from 'react'

export type ThemeName =
  | 'light'
  | 'dark'
  | 'system'
  | 'cheerful'
  | 'calming'
  | 'bright'
  | 'pastel'
  | 'neon'
  | 'minimal-light'
  | 'minimal-dark'
  | 'custom'

export interface CustomThemeConfig {
  accent: string // hex color
  mode: 'light' | 'dark'
}

const STORAGE_KEY = 'clarity-theme'
const CUSTOM_STORAGE_KEY = 'clarity-custom-theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

const VALID_THEMES: ThemeName[] = [
  'light',
  'dark',
  'system',
  'cheerful',
  'calming',
  'bright',
  'pastel',
  'neon',
  'minimal-light',
  'minimal-dark',
  'custom',
]

// Named themes that apply dark class + data-theme
const NAMED_DARK_THEMES: ThemeName[] = ['neon', 'minimal-dark']
// Named themes that remove dark class + data-theme
const NAMED_LIGHT_THEMES: ThemeName[] = ['cheerful', 'calming', 'bright', 'pastel', 'minimal-light']

function getStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && VALID_THEMES.includes(stored as ThemeName)) return stored as ThemeName
  } catch {
    // ignore
  }
  return 'system'
}

function getStoredCustomConfig(): CustomThemeConfig {
  try {
    const stored = localStorage.getItem(CUSTOM_STORAGE_KEY)
    if (stored) return JSON.parse(stored) as CustomThemeConfig
  } catch {
    // ignore
  }
  return { accent: '#6366f1', mode: 'light' }
}

function applyTheme(theme: ThemeName, customConfig?: CustomThemeConfig): boolean {
  const html = document.documentElement

  // Reset state
  html.removeAttribute('data-theme')
  html.style.removeProperty('--theme-custom-accent')

  let isDark = false

  if (theme === 'system') {
    isDark = window.matchMedia(MEDIA_QUERY).matches
    html.classList.toggle('dark', isDark)
  } else if (theme === 'light') {
    html.classList.remove('dark')
    isDark = false
  } else if (theme === 'dark') {
    html.classList.add('dark')
    isDark = true
  } else if (NAMED_DARK_THEMES.includes(theme)) {
    html.classList.add('dark')
    html.setAttribute('data-theme', theme)
    isDark = true
  } else if (NAMED_LIGHT_THEMES.includes(theme)) {
    html.classList.remove('dark')
    html.setAttribute('data-theme', theme)
    isDark = false
  } else if (theme === 'custom') {
    const config = customConfig ?? getStoredCustomConfig()
    isDark = config.mode === 'dark'
    html.classList.toggle('dark', isDark)
    html.setAttribute('data-theme', 'custom')
    html.style.setProperty('--theme-custom-accent', config.accent)
  }

  return isDark
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(getStoredTheme)
  const [customConfig, setCustomConfigState] = useState<CustomThemeConfig>(getStoredCustomConfig)
  const [isDark, setIsDark] = useState(() => applyTheme(getStoredTheme(), getStoredCustomConfig()))

  const setTheme = useCallback(
    (newTheme: ThemeName) => {
      localStorage.setItem(STORAGE_KEY, newTheme)
      setThemeState(newTheme)
      setIsDark(applyTheme(newTheme, customConfig))
    },
    [customConfig]
  )

  const setCustomConfig = useCallback(
    (config: CustomThemeConfig) => {
      localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(config))
      setCustomConfigState(config)
      if (theme === 'custom') {
        setIsDark(applyTheme('custom', config))
      }
    },
    [theme]
  )

  // Re-apply whenever theme or customConfig changes
  useEffect(() => {
    setIsDark(applyTheme(theme, customConfig))
  }, [theme, customConfig])

  // Respond to OS dark-mode changes when in 'system' mode
  useEffect(() => {
    const mql = window.matchMedia(MEDIA_QUERY)
    const handler = () => {
      if (theme === 'system') setIsDark(applyTheme('system'))
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  return { theme, setTheme, isDark, customConfig, setCustomConfig }
}
