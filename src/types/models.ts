import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Thought = Database['public']['Tables']['thoughts']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type CalendarEvent = Database['public']['Tables']['events']['Row']
export type Birthday = Database['public']['Tables']['birthdays']['Row']
export type Folder = Database['public']['Tables']['folders']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type FileRecord = Database['public']['Tables']['files']['Row']

export type TaskStatus = 'active' | 'done' | 'hold'
export type TaskEnergy = 'low' | 'medium' | 'high'
export type TaskTimeCategory = 'overdue' | 'now' | 'soon' | 'later'
export type ThoughtStatus = 'inbox' | 'converted' | 'archived'
export type ConvertType = 'task' | 'event' | 'note' | 'idea'
export type PlannerView = 'day' | 'week' | 'month'

export const BATCH_TYPES = [
  'paperwork',
  'cleaning',
  'planning',
  'project',
  'running-around',
] as const

export const ENERGY_LEVELS: TaskEnergy[] = ['low', 'medium', 'high']

export const EVENT_COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
] as const

export interface TaskFilters {
  status?: TaskStatus | 'all'
  timeCategory?: TaskTimeCategory | 'all'
  energy?: TaskEnergy | 'all'
  batchType?: string | 'all'
}
