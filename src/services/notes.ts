import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Note } from '@/types'

type NoteInsert = Omit<Database['public']['Tables']['notes']['Insert'], 'user_id'>
type NoteUpdate = Database['public']['Tables']['notes']['Update']

export async function getNotes(
  userId: string,
  folderId: string | null,
  tags?: string[],
): Promise<Note[]> {
  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)

  if (folderId === null) {
    query = query.is('folder_id', null)
  } else {
    query = query.eq('folder_id', folderId)
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  query = query
    .order('pinned', { ascending: false })
    .order('updated_at', { ascending: false })

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getRecentNotes(
  userId: string,
  limit: number = 5,
): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function searchNotes(
  userId: string,
  query: string,
): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createNote(
  userId: string,
  noteData: NoteInsert,
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({ ...noteData, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNote(
  id: string,
  updates: NoteUpdate,
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) throw error
}
