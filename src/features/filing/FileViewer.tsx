import { useEffect, useState } from 'react'
import { ExternalLink, File as FileIcon } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { getFileUrl } from '@/services/files'
import type { FileRecord } from '@/types'

interface FileViewerProps {
  isOpen: boolean
  onClose: () => void
  file: FileRecord | null
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return 'Unknown size'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileViewer({ isOpen, onClose, file }: FileViewerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!isOpen || !file) {
      setSignedUrl(null)
      setError(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)

    getFileUrl(file.storage_path)
      .then((url) => {
        if (!cancelled) setSignedUrl(url)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen, file])

  if (!file) return null

  const isImage = file.mime_type?.startsWith('image/')
  const isPdf = file.mime_type?.includes('pdf')

  const openInNewTab = () => {
    if (signedUrl) {
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={file.file_name}>
      <div className="flex flex-col gap-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <p className="py-8 text-center text-sm text-red-600 dark:text-red-400">
            Failed to load file preview.
          </p>
        )}

        {!loading && !error && signedUrl && (
          <>
            {isImage && (
              <img
                src={signedUrl}
                alt={file.file_name}
                className="w-full rounded-lg object-contain"
                style={{ maxHeight: '60vh' }}
              />
            )}

            {isPdf && (
              <iframe
                src={signedUrl}
                title={file.file_name}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
                style={{ height: '60vh' }}
              />
            )}

            {!isImage && !isPdf && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                  <FileIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {file.file_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {file.mime_type ?? 'Unknown type'} &middot; {formatBytes(file.file_size_bytes)}
                  </p>
                </div>
                <Button variant="primary" onClick={openInNewTab}>
                  <ExternalLink className="h-4 w-4" />
                  Open File
                </Button>
              </div>
            )}

            {/* Always show metadata for image/pdf too */}
            {(isImage || isPdf) && (
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{file.mime_type}</span>
                <span>{formatBytes(file.file_size_bytes)}</span>
              </div>
            )}
          </>
        )}
      </div>
    </BottomSheet>
  )
}
