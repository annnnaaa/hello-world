import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useFiling } from '@/hooks/useFiling'
import { useAppStore } from '@/store/appStore'
import type { Document } from '@/types'
import { X, Plus } from 'lucide-react'

interface DocumentFormProps {
  open: boolean
  onClose: () => void
  doc?: Document
  defaultFolderId?: string | null
}

export function DocumentForm({ open, onClose, doc, defaultFolderId }: DocumentFormProps) {
  const { addDocument, updateDocument, folders } = useFiling()
  const { showToast } = useAppStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notes, setNotes] = useState('')
  const [folderId, setFolderId] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (doc) {
      setTitle(doc.title)
      setContent(doc.content ?? '')
      setNotes(doc.notes ?? '')
      setFolderId(doc.folder_id ?? '')
      setTags(doc.tags)
    } else {
      setTitle('')
      setContent('')
      setNotes('')
      setFolderId(defaultFolderId ?? '')
      setTags([])
    }
    setTagInput('')
  }, [doc, defaultFolderId, open])

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(p => [...p, t])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags(p => p.filter(t => t !== tag))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const data = {
      title: title.trim(),
      content: content.trim() || null,
      notes: notes.trim() || null,
      folder_id: folderId || null,
      tags,
      file_url: doc?.file_url ?? null,
      file_name: doc?.file_name ?? null,
      file_type: doc?.file_type ?? null,
      file_size: doc?.file_size ?? null,
    }

    if (doc) {
      await updateDocument(doc.id, data)
      showToast('Document updated', 'success')
    } else {
      await addDocument(data)
      showToast('Note created', 'success')
    }

    setLoading(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={doc ? 'Edit document' : 'New note'} size="full">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Document title" required autoFocus />

        <Textarea
          label="Content / notes"
          value={content || notes}
          onChange={e => { setContent(e.target.value); setNotes(e.target.value) }}
          rows={5}
          placeholder="Write your note here..."
        />

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Folder</label>
          <select
            value={folderId}
            onChange={e => setFolderId(e.target.value)}
            className="input-base appearance-none"
          >
            <option value="">No folder</option>
            {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map(tag => (
              <span key={tag} className="tag-chip flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag…"
              className="input-base flex-1 py-2"
            />
            <Button type="button" variant="secondary" onClick={addTag} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">
            {doc ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
