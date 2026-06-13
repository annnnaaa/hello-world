import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, onClick, padding = 'md' }: CardProps) {
  const padMap = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-5' }
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'card',
        padMap[padding],
        onClick && 'cursor-pointer hover:shadow-card-hover active:scale-[0.98] transition-all duration-150',
        className
      )}
    >
      {children}
    </div>
  )
}
