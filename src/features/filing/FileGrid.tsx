import { FolderOpen } from 'lucide-react'
import { NoteCard } from '@/components/shared/NoteCard'
import { FileCard } from '@/components/shared/FileCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Note, FileRecord } from '@/types'

interface FileGridProps {
  notes: Note[]
  files: FileRecord[]
  onTapNote: (note: Note) => void
  onTapFile: (file: FileRecord) => void
}

export function FileGrid({ notes, files, onTapNote, onTapFile }: FileGridProps) {
  if (notes.length === 0 && files.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="Nothing here yet"
        description="Create a note, upload a file, or add a sub-folder to get started."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onTap={onTapNote} />
      ))}
      {files.map((file) => (
        <FileCard key={file.id} file={file} onTap={onTapFile} />
      ))}
    </div>
  )
}
