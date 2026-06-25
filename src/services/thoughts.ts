import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Thought } from '@/types'

type ThoughtUpdate = Database['public']['Tables']['thoughts']['Update']

export async function getInboxThoughts(userId: string): Promise<Thought[]> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'inbox')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createThought(
  userId: string,
  content: string,
): Promise<Thought> {
  const { data, error } = await supabase
    .from('thoughts')
    .insert({ user_id: userId, content })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateThought(
  id: string,
  updates: ThoughtUpdate,
): Promise<Thought> {
  const { data, error } = await supabase
    .from('thoughts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function archiveThought(id: string): Promise<Thought> {
  const { data, error } = await supabase
    .from('thoughts')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteThought(id: string): Promise<void> {
  const { error } = await supabase
    .from('thoughts')
    .delete()
    .eq('id', id)

  if (error) throw error
}
