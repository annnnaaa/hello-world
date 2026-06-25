import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  onClick?: () => void
}

export function Card({ className, onClick, children, ...props }: CardProps) {
  const isInteractive = !!onClick

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        'rounded-xl bg-white shadow-sm border border-slate-200',
        'dark:bg-slate-800 dark:border-slate-700',
        isInteractive && [
          'cursor-pointer select-none',
          'transition-colors',
          'hover:bg-slate-50 active:bg-slate-100',
          'dark:hover:bg-slate-750 dark:active:bg-slate-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-offset-slate-900',
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
