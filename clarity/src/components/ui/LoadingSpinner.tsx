import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 'md', className, label = 'Loading…' }: LoadingSpinnerProps) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 py-8', className)} aria-label={label}>
      <LoaderCircle className={cn(sizeMap[size], 'animate-spin text-brand-500')} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}
