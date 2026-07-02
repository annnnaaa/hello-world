import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Settings,
  ChevronRight,
  X,
  User,
  Palette,
  LogIn,
  LogOut,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/ui/Toast'
import { ThemePicker } from '@/components/shared/ThemePicker'

type ActivePanel = 'theme' | 'login' | 'account' | 'preferences' | null

const THEME_DISPLAY_NAMES: Record<string, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  cheerful: 'Cheerful',
  calming: 'Calming',
  bright: 'Bright',
  pastel: 'Pastel',
  neon: 'Neon',
  'minimal-light': 'Minimal Light',
  'minimal-dark': 'Minimal Dark',
  custom: 'Custom',
}

const PREF_ITEMS = [
  'Layouts',
  'Notifications',
  'Connections & integrations',
  'Share',
]

// ── Panel header ────────────────────────────────────────────────────────────

function PanelHeader({
  title,
  onClose,
}: {
  title: string
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </span>
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
          'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
          'dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300'
        )}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── Theme panel ─────────────────────────────────────────────────────────────

function ThemePanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <PanelHeader title="Theme" onClose={onClose} />
      <div className="overflow-y-auto p-3 max-h-80 scrollbar-hide">
        <ThemePicker compact />
      </div>
    </>
  )
}

// ── Login / Logout panel ────────────────────────────────────────────────────

function LoginPanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)

  const initial = (profile?.display_name ?? user?.email ?? '?')
    .slice(0, 1)
    .toUpperCase()

  const handleSignOut = async () => {
    onClose()
    await signOut()
  }

  const handleSignIn = () => {
    onClose()
    navigate('/auth')
  }

  return (
    <>
      <PanelHeader title={user ? 'Account' : 'Sign in'} onClose={onClose} />
      <div className="p-4">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  'bg-accent-100 text-accent-600 text-sm font-bold',
                  'dark:bg-accent-900/40 dark:text-accent-400'
                )}
              >
                {initial}
              </div>
              <div className="min-w-0">
                {profile?.display_name && (
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {profile.display_name}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'bg-red-50 text-red-600 hover:bg-red-100',
                'dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
              )}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to sync your data across devices.
            </p>
            <button
              type="button"
              onClick={handleSignIn}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'bg-accent-500 text-white hover:bg-accent-600'
              )}
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── Account panel ───────────────────────────────────────────────────────────

function AccountPanel({ onClose }: { onClose: () => void }) {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)

  const initial = (profile?.display_name ?? user?.email ?? '?')
    .slice(0, 1)
    .toUpperCase()

  return (
    <>
      <PanelHeader title="Account" onClose={onClose} />
      <div className="p-4 space-y-3">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  'bg-accent-100 text-accent-600 text-sm font-bold',
                  'dark:bg-accent-900/40 dark:text-accent-400'
                )}
              >
                {initial}
              </div>
              <div className="min-w-0">
                {profile?.display_name && (
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {profile.display_name}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              Edit details in Settings
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Not signed in
          </p>
        )}
      </div>
    </>
  )
}

// ── Preferences panel ────────────────────────────────────────────────────────

function PreferencesPanel({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()

  return (
    <>
      <PanelHeader title="Preferences" onClose={onClose} />
      <div className="p-1">
        {PREF_ITEMS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => toast(`${item} — coming soon`, 'info')}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors',
              'text-slate-700 hover:bg-slate-100',
              'dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            <span>{item}</span>
            <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </button>
        ))}
      </div>
    </>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function SettingsDropdown() {
  const [open, setOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { theme } = useTheme()
  const user = useAuthStore((s) => s.user)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setActivePanel(null)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleClose = () => {
    setOpen(false)
    setActivePanel(null)
  }

  const mainMenuItems = [
    {
      key: 'settings',
      icon: Settings,
      label: 'Settings',
      meta: null as string | null,
      onClick: () => {
        handleClose()
        navigate('/settings')
      },
    },
    {
      key: 'login',
      icon: user ? LogOut : LogIn,
      label: user ? 'Logout' : 'Login',
      meta: user?.email ?? null,
      onClick: () => setActivePanel('login'),
    },
    {
      key: 'theme',
      icon: Palette,
      label: 'Theme',
      meta: THEME_DISPLAY_NAMES[theme] ?? theme,
      onClick: () => setActivePanel('theme'),
    },
    {
      key: 'account',
      icon: User,
      label: 'Account',
      meta: null,
      onClick: () => setActivePanel('account'),
    },
    {
      key: 'preferences',
      icon: Zap,
      label: 'Preferences',
      meta: null,
      onClick: () => setActivePanel('preferences'),
    },
  ] as const

  return (
    <div ref={ref} className="relative">
      {/* Gear icon trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
          if (open) setActivePanel(null)
        }}
        aria-label="Settings"
        aria-expanded={open}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
          'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
          open && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
        )}
      >
        <Settings className="h-4 w-4" />
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 top-11 z-50 w-72 max-w-sm rounded-xl border shadow-xl',
            'bg-white border-slate-200',
            'dark:bg-slate-900 dark:border-slate-700'
          )}
        >
          {activePanel === null && (
            /* ── Main menu ─────────────────────────────────────────── */
            <div className="p-1">
              {mainMenuItems.map(({ key, icon: Icon, label, meta, onClick }) => (
                <button
                  key={key}
                  type="button"
                  onClick={onClick}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    'text-slate-700 hover:bg-slate-100',
                    'dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <span className="flex-1 text-left font-medium">{label}</span>
                  {meta && (
                    <span className="max-w-[6rem] truncate text-xs text-slate-400 dark:text-slate-500">
                      {meta}
                    </span>
                  )}
                  {key !== 'settings' && (
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                  )}
                </button>
              ))}
            </div>
          )}

          {activePanel === 'theme' && <ThemePanel onClose={handleClose} />}
          {activePanel === 'login' && <LoginPanel onClose={handleClose} />}
          {activePanel === 'account' && <AccountPanel onClose={handleClose} />}
          {activePanel === 'preferences' && <PreferencesPanel onClose={handleClose} />}
        </div>
      )}
    </div>
  )
}
