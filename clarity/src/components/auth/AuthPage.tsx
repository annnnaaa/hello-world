import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Sparkles } from 'lucide-react'

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, fullName)

    setLoading(false)
    if (error) {
      setError(error.message)
    } else if (mode === 'signup') {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <button className="mt-6 text-brand-500 text-sm font-medium" onClick={() => { setMode('login'); setSuccess(false) }}>
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clarity</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {mode === 'login' ? 'Welcome back' : 'Create your calm space'}
          </p>
        </div>

        <form onSubmit={handle} className="space-y-4">
          {mode === 'signup' && (
            <Input
              label="Your name"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Anna"
              required
              autoFocus
            />
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus={mode === 'login'}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">{error}</p>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            className="text-sm text-brand-500 font-medium"
            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(null) }}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8">
          Your data is private and secure. No ads, ever.
        </p>
      </div>
    </div>
  )
}
