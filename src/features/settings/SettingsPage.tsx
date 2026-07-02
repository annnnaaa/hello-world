import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, LogOut } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemePicker } from '@/components/shared/ThemePicker'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const PREF_ITEMS = [
  'Layouts',
  'Notifications',
  'Connections & integrations',
  'Share',
]

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
        {title}
      </h2>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        {children}
      </div>
    </section>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const fetchProfile = useAuthStore((s) => s.fetchProfile)

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [savingName, setSavingName] = useState(false)

  const initial = (profile?.display_name ?? user?.email ?? '?')
    .slice(0, 1)
    .toUpperCase()

  const handleSaveName = async () => {
    if (!user) return
    setSavingName(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() || null, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      await fetchProfile()
      toast('Display name updated', 'success')
    } catch {
      toast('Failed to save name', 'error')
    } finally {
      setSavingName(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <>
      <TopBar title="Settings" showBack />
      <PageContainer className="space-y-6 py-6">
        {/* ── Account ─────────────────────────────────────────────── */}
        <Section title="Account">
          <div className="p-4 space-y-4">
            {/* Avatar initial */}
            <div className="flex justify-center">
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold',
                  'bg-accent-100 text-accent-600',
                  'dark:bg-accent-900/40 dark:text-accent-400'
                )}
              >
                {initial}
              </div>
            </div>

            {/* Display name */}
            <Input
              label="Display name"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            {/* Email (read-only) */}
            <Input
              label="Email"
              value={user?.email ?? ''}
              readOnly
              disabled
              className="opacity-70 cursor-not-allowed"
            />

            <Button
              onClick={handleSaveName}
              loading={savingName}
              fullWidth
              disabled={savingName}
            >
              Save changes
            </Button>
          </div>
        </Section>

        {/* ── Theme ───────────────────────────────────────────────── */}
        <Section title="Theme">
          <div className="p-4">
            <ThemePicker />
          </div>
        </Section>

        {/* ── Preferences ─────────────────────────────────────────── */}
        <Section title="Preferences">
          {PREF_ITEMS.map((item, idx) => (
            <button
              key={item}
              type="button"
              onClick={() => toast(`${item} — coming soon`, 'info')}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3 text-sm transition-colors',
                'text-slate-700 hover:bg-slate-50',
                'dark:text-slate-300 dark:hover:bg-slate-800/50',
                idx < PREF_ITEMS.length - 1 &&
                  'border-b border-slate-100 dark:border-slate-800'
              )}
            >
              <span>{item}</span>
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </button>
          ))}
        </Section>

        {/* ── Danger zone ─────────────────────────────────────────── */}
        <Section title="Danger zone">
          <div className="p-4">
            <Button
              variant="danger"
              fullWidth
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </Section>
      </PageContainer>
    </>
  )
}
