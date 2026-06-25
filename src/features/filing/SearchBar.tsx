import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/useDebounce'
import { searchNotes } from '@/services/notes'
import { searchFiles } from '@/services/files'
import { noteKeys, fileKeys } from '@/lib/queryKeys'
import { NoteCard } from '@/components/shared/NoteCard'
import { FileCard } from '@/components/shared/FileCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'
import type { Note, FileRecord } from '@/types'

interface SearchBarProps {
  userId: string
  onTapNote?: (note: Note) => void
  onTapFile?: (file: FileRecord) => void
}

export function SearchBar({ userId, onTapNote, onTapFile }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const hasQuery = debouncedQuery.trim().length > 0

  const notesResult = useQuery({
    queryKey: noteKeys.search(debouncedQuery),
    queryFn: () => searchNotes(userId, debouncedQuery),
    enabled: hasQuery,
  })

  const filesResult = useQuery({
    queryKey: fileKeys.search(debouncedQuery),
    queryFn: () => searchFiles(userId, debouncedQuery),
    enabled: hasQuery,
  })

  const notes = notesResult.data ?? []
  const files = filesResult.data ?? []
  const isLoading = notesResult.isLoading || filesResult.isLoading
  const hasResults = notes.length > 0 || files.length > 0

  const handleClose = () => {
    setQuery('')
    setIsExpanded(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search toggle / input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!isExpanded) setIsExpanded(true)
          }}
          onFocus={() => setIsExpanded(true)}
          placeholder="Search notes & files..."
          className={cn(
            'block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10',
            'text-sm text-slate-900 placeholder:text-slate-400',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500',
            'border-slate-300 dark:border-slate-600',
            'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
          )}
        />
        {isExpanded && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search results */}
      <AnimatePresence>
        {isExpanded && hasQuery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {isLoading && (
              <p className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
                Searching...
              </p>
            )}

            {!isLoading && !hasResults && (
              <EmptyState
                icon={Search}
                title="No results"
                description={`Nothing found for "${debouncedQuery}"`}
                className="py-6"
              />
            )}

            {!isLoading && hasResults && (
              <div className="flex flex-col gap-2">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} onTap={onTapNote} />
                ))}
                {files.map((file) => (
                  <FileCard key={file.id} file={file} onTap={onTapFile} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
