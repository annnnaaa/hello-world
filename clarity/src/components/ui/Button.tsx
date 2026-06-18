import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { LoaderCircle } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}, ref) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 font-medium text-sm transition-all duration-150 active:scale-95',
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: '',
    lg: 'px-6 py-4 text-base',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        variantClasses[variant],
        size !== 'md' && sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        'flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
