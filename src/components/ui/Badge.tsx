import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const variantStyles = {
  default:
    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  success:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  danger:
    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  info:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
} as const

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[11px]',
  md: 'px-2.5 py-0.5 text-xs',
} as const

interface BadgeProps {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  className?: string
  children: ReactNode
}

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}
