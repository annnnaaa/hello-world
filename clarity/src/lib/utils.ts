import { type ClassValue, clsx } from 'clsx'
import { format, isToday, isTomorrow, isPast, isThisWeek, parseISO, differenceInDays } from 'date-fns'
import type { Task, TaskStatus, PlannerItem, CalendarEvent, Birthday } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  const d = parseISO(dateStr)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isThisWeek(d)) return format(d, 'EEEE')
  return format(d, 'MMM d')
}

export function formatDateTime(dateStr: string): string {
  const d = parseISO(dateStr)
  return format(d, 'MMM d, h:mm a')
}

export function computeTaskStatus(task: Omit<Task, 'status'>): TaskStatus {
  if (task.completed_at) return 'later'
  if (!task.due_date) return 'later'
  const due = parseISO(task.due_date)
  const now = new Date()
  if (isPast(due) && !isToday(due)) return 'overdue'
  if (isToday(due)) return 'now'
  const days = differenceInDays(due, now)
  if (days <= 3) return 'soon'
  return 'later'
}

export function getStatusColor(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    now: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    soon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    later: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    hold: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
  }
  return map[status]
}

export function getEnergyColor(energy: string): string {
  const map: Record<string, string> = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return map[energy] ?? ''
}

export function buildPlannerItems(
  events: CalendarEvent[],
  tasks: Task[],
  birthdays: Birthday[]
): PlannerItem[] {
  const items: PlannerItem[] = []

  for (const e of events) {
    items.push({
      id: e.id,
      type: 'event',
      title: e.title,
      date: e.start_date,
      color: e.color ?? '#6366f1',
      allDay: e.all_day,
      startDate: e.start_date,
      endDate: e.end_date ?? undefined,
    })
  }

  for (const t of tasks) {
    if (t.due_date && !t.completed_at) {
      items.push({
        id: t.id,
        type: 'task',
        title: t.title,
        date: t.due_date,
        status: t.status,
      })
    }
  }

  const thisYear = new Date().getFullYear()
  for (const b of birthdays) {
    const [, month, day] = b.date.split('-')
    items.push({
      id: b.id,
      type: 'birthday',
      title: `${b.name}'s Birthday`,
      date: `${thisYear}-${month}-${day}`,
      color: '#ec4899',
    })
  }

  return items.sort((a, b) => a.date.localeCompare(b.date))
}

export function generateId(): string {
  return crypto.randomUUID()
}
