import { format, addDays } from 'date-fns'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Task, TaskFilters } from '@/types'

type TaskInsert = Omit<Database['public']['Tables']['tasks']['Insert'], 'user_id'>
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export async function getTasks(
  userId: string,
  filters?: TaskFilters,
): Promise<Task[]> {
  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
  const weekOut = format(addDays(new Date(), 7), 'yyyy-MM-dd')

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)

  // Apply status filter
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  // Apply energy filter
  if (filters?.energy && filters.energy !== 'all') {
    query = query.eq('energy', filters.energy)
  }

  // Apply batch type filter
  if (filters?.batchType && filters.batchType !== 'all') {
    query = query.eq('batch_type', filters.batchType)
  }

  // Apply time category filter
  if (filters?.timeCategory && filters.timeCategory !== 'all') {
    switch (filters.timeCategory) {
      case 'overdue':
        query = query
          .lt('due_date', today)
          .eq('status', 'active')
        break
      case 'now':
        query = query
          .eq('due_date', today)
          .eq('status', 'active')
        break
      case 'soon':
        query = query
          .gte('due_date', tomorrow)
          .lte('due_date', weekOut)
          .eq('status', 'active')
        break
      case 'later':
        query = query
          .eq('status', 'active')
          .or(`due_date.gt.${weekOut},due_date.is.null`)
        break
    }
  }

  query = query.order('sort_order', { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getOverdueTasks(userId: string): Promise<Task[]> {
  const today = format(new Date(), 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .lt('due_date', today)
    .order('due_date', { ascending: true })

  if (error) throw error
  return data
}

export async function createTask(
  userId: string,
  taskData: TaskInsert,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...taskData, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(
  id: string,
  updates: TaskUpdate,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function completeTask(id: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: 'done',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}
