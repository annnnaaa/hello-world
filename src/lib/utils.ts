import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isYesterday, addDays, isBefore } from 'date-fns'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d')
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, h:mm a')
}

export function getLocalDateString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getTaskTimeCategory(dueDate: string | null): 'overdue' | 'now' | 'soon' | 'later' {
  if (!dueDate) return 'later'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate + 'T00:00:00')
  if (isBefore(due, today)) return 'overdue'
  if (isToday(due)) return 'now'
  if (isBefore(due, addDays(today, 8))) return 'soon'
  return 'later'
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}
