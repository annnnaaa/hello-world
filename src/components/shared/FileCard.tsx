import { File, Image, FileText, Film, Music } from 'lucide-react'
import { cn, truncate } from '@/lib/utils'
import type { FileRecord } from '@/types'

interface FileCardProps {
  file: FileRecord
  onTap?: (file: FileRecord) => void
}

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return File
  if (mimeType.startsWith('image/')) return Image
  if (mimeType.startsWith('video/')) return Film
  if (mimeType.startsWith('audio/')) return Music
  if (mimeType.includes('pdf')) return FileText
  return File
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileCard({ file, onTap }: FileCardProps) {
  const Icon = getFileIcon(file.mime_type)

  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-slate-800 p-3',
        'border border-slate-200 dark:border-slate-700',
        'active:scale-[0.98] transition-transform cursor-pointer',
      )}
      onClick={() => onTap?.(file)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
          <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{file.file_name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {formatFileSize(file.file_size_bytes)}
          </p>
        </div>
      </div>
      {file.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {file.tags.slice(0, 3).map(tag => (
            <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
