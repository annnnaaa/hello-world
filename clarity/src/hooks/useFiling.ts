import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Folder, Document } from '@/types'
import { useAuth } from './useAuth'
import { generateId } from '@/lib/utils'

export function useFiling() {
  const { user } = useAuth()
  const [folders, setFolders] = useState<Folder[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    const [foldersRes, docsRes] = await Promise.all([
      supabase.from('folders').select('*').eq('user_id', user.id).order('name'),
      supabase.from('documents').select('*').eq('user_id', user.id).order('title'),
    ])
    setFolders(foldersRes.data ?? [])
    setDocuments(docsRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const addFolder = useCallback(async (name: string, parentId: string | null = null, color?: string) => {
    if (!user) return
    const newFolder: Folder = {
      id: generateId(),
      user_id: user.id,
      name,
      parent_id: parentId,
      color: color ?? null,
      created_at: new Date().toISOString(),
    }
    setFolders(prev => [...prev, newFolder].sort((a, b) => a.name.localeCompare(b.name)))
    await supabase.from('folders').insert(newFolder)
  }, [user])

  const deleteFolder = useCallback(async (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id))
    await supabase.from('folders').delete().eq('id', id)
  }, [])

  const addDocument = useCallback(async (doc: Omit<Document, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null
    const now = new Date().toISOString()
    const newDoc: Document = {
      ...doc,
      id: generateId(),
      user_id: user.id,
      created_at: now,
      updated_at: now,
    }
    setDocuments(prev => [newDoc, ...prev])
    await supabase.from('documents').insert(newDoc)
    return newDoc
  }, [user])

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>) => {
    const updatedAt = new Date().toISOString()
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates, updated_at: updatedAt } : d))
    await supabase.from('documents').update({ ...updates, updated_at: updatedAt }).eq('id', id)
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
    await supabase.from('documents').delete().eq('id', id)
  }, [])

  const uploadFile = useCallback(async (file: File, folderId: string | null) => {
    if (!user) return null
    const path = `${user.id}/${generateId()}-${file.name}`
    const { data, error } = await supabase.storage.from('documents').upload(path, file)
    if (error || !data) return null
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
    return addDocument({
      folder_id: folderId,
      title: file.name.replace(/\.[^.]+$/, ''),
      content: null,
      file_url: publicUrl,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      notes: null,
      tags: [],
    })
  }, [user, addDocument])

  const buildTree = useCallback((): Folder[] => {
    const map = new Map<string, Folder>()
    folders.forEach(f => map.set(f.id, { ...f, children: [] }))
    const roots: Folder[] = []
    map.forEach(f => {
      if (f.parent_id && map.has(f.parent_id)) {
        map.get(f.parent_id)!.children!.push(f)
      } else {
        roots.push(f)
      }
    })
    return roots
  }, [folders])

  const docsInFolder = useCallback((folderId: string | null) => {
    return documents.filter(d => d.folder_id === folderId)
  }, [documents])

  const search = useCallback((query: string) => {
    if (!query.trim()) return documents
    const q = query.toLowerCase()
    return documents.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.notes?.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [documents])

  return {
    folders, documents, loading, currentFolder, setCurrentFolder,
    addFolder, deleteFolder, addDocument, updateDocument, deleteDocument,
    uploadFile, buildTree, docsInFolder, search, refresh: fetch,
  }
}
