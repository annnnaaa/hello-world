import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { BrainDumpEntry, UnsortedThought, ThoughtCategory } from '@/types'
import { useAuth } from './useAuth'
import { generateId } from '@/lib/utils'

export function useBrainDump() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<BrainDumpEntry[]>([])
  const [unsorted, setUnsorted] = useState<UnsortedThought[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUnsorted = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('unsorted_thoughts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setUnsorted(data ?? [])
  }, [user])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchUnsorted().then(() => setLoading(false))
  }, [user, fetchUnsorted])

  const dump = useCallback(async (content: string) => {
    if (!user || !content.trim()) return
    const entry: BrainDumpEntry = {
      id: generateId(),
      user_id: user.id,
      content: content.trim(),
      is_sorted: false,
      created_at: new Date().toISOString(),
    }
    const thought: UnsortedThought = {
      id: generateId(),
      user_id: user.id,
      content: content.trim(),
      brain_dump_id: entry.id,
      created_at: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setUnsorted(prev => [thought, ...prev])
    await supabase.from('brain_dump_entries').insert(entry)
    await supabase.from('unsorted_thoughts').insert(thought)
  }, [user])

  const sortThought = useCallback(async (
    thoughtId: string,
    category: ThoughtCategory,
    content: string
  ) => {
    setUnsorted(prev => prev.filter(t => t.id !== thoughtId))
    await supabase.from('unsorted_thoughts').delete().eq('id', thoughtId)

    if (category === 'task') {
      await supabase.from('tasks').insert({
        id: generateId(),
        user_id: user!.id,
        title: content,
        status: 'later',
        energy: 'medium',
        batch_type: 'planning',
        priority: 3,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } else if (category === 'event') {
      await supabase.from('calendar_events').insert({
        id: generateId(),
        user_id: user!.id,
        title: content,
        start_date: new Date().toISOString().split('T')[0],
        all_day: true,
        created_at: new Date().toISOString(),
      })
    } else if (category === 'note') {
      await supabase.from('notes').insert({
        id: generateId(),
        user_id: user!.id,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } else if (category === 'idea') {
      await supabase.from('ideas').insert({
        id: generateId(),
        user_id: user!.id,
        content,
        created_at: new Date().toISOString(),
      })
    }
  }, [user])

  const deleteThought = useCallback(async (id: string) => {
    setUnsorted(prev => prev.filter(t => t.id !== id))
    await supabase.from('unsorted_thoughts').delete().eq('id', id)
  }, [])

  return { entries, unsorted, loading, dump, sortThought, deleteThought, refresh: fetchUnsorted }
}
