import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task } from '@/types'
import { useAuth } from './useAuth'
import { generateId } from '@/lib/utils'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .is('completed_at', null)
      .order('due_date', { ascending: true, nullsFirst: false })
    setTasks(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
    if (!user) return null
    const newTask: Task = {
      ...task,
      id: generateId(),
      user_id: user.id,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
    const { error } = await supabase.from('tasks').insert(newTask)
    if (error) { fetch(); return null }
    return newTask
  }, [user, fetch])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    await supabase.from('tasks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
  }, [])

  const completeTask = useCallback(async (id: string) => {
    const completedAt = new Date().toISOString()
    setTasks(prev => prev.filter(t => t.id !== id))
    await supabase.from('tasks').update({ completed_at: completedAt, status: 'later' }).eq('id', id)
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }, [])

  return { tasks, loading, addTask, updateTask, completeTask, deleteTask, refresh: fetch }
}
