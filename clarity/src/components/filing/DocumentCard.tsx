import { useState } from 'react'
import { FileText, File, Trash2, Pencil, ExternalLink, Tag } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import type { Document } from '@/types'
import { useFiling } from '@/hooks/useFiling'
import { useAppStore } from '@/store/appStore'
import { DocumentForm } from './DocumentForm'

interface DocumentCardProps {
  doc: Document
}

function FileIcon({ type }: { type: string | null }) {
  if (!type) return <FileText className="w-5 h-5 text-brand-500" />
  if (type.includes('pdf')) return <File className="w-5 h-5 text-red-500" />
  if (type.includes('image')) return <File className="w-5 h-5 text-green-500" />
  if (type.includes('word') || type.includes('document')) return <File className="w-5 h-5 text-blue-500" />
  return <FileText className="w-5 h-5 text-slate-500" />
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const { deleteDocument } = useFiling()
  const { showToast } = useAppStore()
  const [editOpen, setEditOpen] = useState(false)

  const handleDelete = async () => {
    await deleteDocument(doc.id)
    showToast('Document deleted', 'info')
  }

  return (
    <>
      <Card padding="md" className="animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <FileIcon type={doc.file_type} />
          </div>

          <div className="flex-1 min-w-0" onClick={() => setEditOpen(true)} role="button">
            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{doc.title}</p>
            {doc.notes && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{doc.notes}</p>}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {doc.tags.map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDate(doc.updated_at)}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {doc.file_url && (
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                aria-label="Open file"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      <DocumentForm open={editOpen} onClose={() => setEditOpen(false)} doc={doc} />
    </>
  )
}
