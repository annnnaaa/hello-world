import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

type AuthTab = 'login' | 'signup'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login')

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        {/* Logo & Tagline */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-accent-600 dark:text-accent-400">
            Clarity
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your calm personal dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className={cn(
            'rounded-2xl border bg-white p-6 shadow-sm',
            'dark:border-slate-800 dark:bg-slate-900'
          )}
        >
          {/* Tab Toggle */}
          <div
            className={cn(
              'mb-6 flex rounded-lg bg-slate-100 p-1',
              'dark:bg-slate-800'
            )}
          >
            {(['login', 'signup'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative flex-1 rounded-md py-2 text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-slate-700"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === 'login' ? 'Log In' : 'Sign Up'}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
