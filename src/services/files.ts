import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { FileRecord } from '@/types'

type FileUpdate = Database['public']['Tables']['files']['Update']

export async function getFiles(
  userId: string,
  folderId: string | null,
  tags?: string[],
): Promise<FileRecord[]> {
  let query = supabase
    .from('files')
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

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function searchFiles(
  userId: string,
  query: string,
): Promise<FileRecord[]> {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', userId)
    .or(`file_name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function uploadFile(
  userId: string,
  folderId: string | null,
  file: File,
): Promise<FileRecord> {
  const fileExt = file.name.split('.').pop()
  const storagePath = `${userId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('files')
    .upload(storagePath, file)

  if (uploadError) throw uploadError

  const { data, error: insertError } = await supabase
    .from('files')
    .insert({
      user_id: userId,
      folder_id: folderId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      file_size_bytes: file.size,
    })
    .select()
    .single()

  if (insertError) {
    // Clean up uploaded file if DB insert fails
    await supabase.storage.from('files').remove([storagePath])
    throw insertError
  }

  return data
}

export async function getFileUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('files')
    .createSignedUrl(storagePath, 3600)

  if (error) throw error
  return data.signedUrl
}

export async function deleteFile(
  id: string,
  storagePath: string,
): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from('files')
    .remove([storagePath])

  if (storageError) throw storageError

  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', id)

  if (dbError) throw dbError
}

export async function updateFile(
  id: string,
  updates: FileUpdate,
): Promise<FileRecord> {
  const { data, error } = await supabase
    .from('files')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
