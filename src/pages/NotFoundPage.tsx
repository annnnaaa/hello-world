import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-slate-200 dark:text-slate-700">404</p>
      <p className="mt-4 text-lg font-medium">Page not found</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist.
      </p>
      <Button className="mt-6" onClick={() => navigate('/')}>
        <Home className="mr-2 h-4 w-4" />
        Go Home
      </Button>
    </div>
  )
}
