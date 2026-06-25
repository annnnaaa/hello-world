import { useAuthStore } from '@/stores/authStore'

let initialized = false

export function useAuth() {
  const session = useAuthStore((s) => s.session)
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const loading = useAuthStore((s) => s.loading)
  const signIn = useAuthStore((s) => s.signIn)
  const signUp = useAuthStore((s) => s.signUp)
  const signOut = useAuthStore((s) => s.signOut)
  const initialize = useAuthStore((s) => s.initialize)

  if (!initialized) {
    initialized = true
    initialize()
  }

  return { session, user, profile, loading, signIn, signUp, signOut }
}
