export type TaskStatus = 'overdue' | 'now' | 'soon' | 'later' | 'hold'
export type TaskEnergy = 'low' | 'medium' | 'high'
export type BatchType = 'paperwork' | 'cleaning' | 'planning' | 'project' | 'errands' | 'custom'
export type ThoughtCategory = 'task' | 'event' | 'note' | 'idea'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  streak_count: number
  tasks_completed_today: number
}

export interface BrainDumpEntry {
  id: string
  user_id: string
  content: string
  is_sorted: boolean
  created_at: string
}

export interface UnsortedThought {
  id: string
  user_id: string
  content: string
  brain_dump_id: string | null
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  energy: TaskEnergy
  batch_type: BatchType
  custom_batch: string | null
  due_date: string | null
  priority: number
  completed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  all_day: boolean
  color: string | null
  created_at: string
}

export interface Birthday {
  id: string
  user_id: string
  name: string
  date: string
  notes: string | null
  created_at: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  parent_id: string | null
  color: string | null
  created_at: string
  children?: Folder[]
}

export interface Document {
  id: string
  user_id: string
  folder_id: string | null
  title: string
  content: string | null
  file_url: string | null
  file_name: string | null
  file_type: string | null
  file_size: number | null
  notes: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string | null
  content: string
  document_id: string | null
  folder_id: string | null
  created_at: string
  updated_at: string
}

export interface Idea {
  id: string
  user_id: string
  content: string
  created_at: string
}

export interface PlannerItem {
  id: string
  type: 'task' | 'event' | 'birthday'
  title: string
  date: string
  color?: string
  status?: TaskStatus
  allDay?: boolean
  startDate?: string
  endDate?: string
}

export interface QuickAddType {
  type: 'brain_dump' | 'task' | 'event' | 'note'
}
