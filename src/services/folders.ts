import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Folder } from '@/types'

type FolderInsert = Omit<Database['public']['Tables']['folders']['Insert'], 'user_id'>
type FolderUpdate = Database['public']['Tables']['folders']['Update']

export async function getFolders(
  userId: string,
  parentId: string | null,
): Promise<Folder[]> {
  let query = supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId)

  if (parentId === null) {
    query = query.is('parent_id', null)
  } else {
    query = query.eq('parent_id', parentId)
  }

  query = query.order('sort_order', { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function createFolder(
  userId: string,
  folderData: FolderInsert,
): Promise<Folder> {
  const { data, error } = await supabase
    .from('folders')
    .insert({ ...folderData, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFolder(
  id: string,
  updates: FolderUpdate,
): Promise<Folder> {
  const { data, error } = await supabase
    .from('folders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id)

  if (error) throw error
}
