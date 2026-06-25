import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FolderPlus, StickyNote, FileArchive, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { getFolders, deleteFolder } from '@/services/folders'
import { getNotes } from '@/services/notes'
import { getFiles } from '@/services/files'
import { folderKeys, noteKeys, fileKeys } from '@/lib/queryKeys'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { FolderBreadcrumb } from './FolderBreadcrumb'
import { FolderGrid } from './FolderGrid'
import { FileGrid } from './FileGrid'
import { FolderSheet } from './FolderSheet'
import { NoteSheet } from './NoteSheet'
import { FileUploadZone } from './FileUploadZone'
import { SearchBar } from './SearchBar'
import type { Folder, Note, FileRecord } from '@/types'

export function FilingPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const currentFolderId = useUiStore((s) => s.currentFolderId)
  const navigateFolder = useUiStore((s) => s.navigateFolder)

  const [folderSheetOpen, setFolderSheetOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [noteSheetOpen, setNoteSheetOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Folder | null>(null)

  const { data: folders = [], isLoading: loadingFolders } = useQuery({
    queryKey: folderKeys.children(currentFolderId),
    queryFn: () => getFolders(user!.id, currentFolderId),
    enabled: !!user,
  })

  const { data: notes = [], isLoading: loadingNotes } = useQuery({
    queryKey: noteKeys.inFolder(currentFolderId),
    queryFn: () => getNotes(user!.id, currentFolderId),
    enabled: !!user,
  })

  const { data: files = [], isLoading: loadingFiles } = useQuery({
    queryKey: fileKeys.inFolder(currentFolderId),
    queryFn: () => getFiles(user!.id, currentFolderId),
    enabled: !!user,
  })

  const deleteFolderMutation = useMutation({
    mutationFn: (id: string) => deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
      toast('Folder deleted', 'success')
      setDeleteTarget(null)
    },
    onError: () => toast('Failed to delete folder', 'error'),
  })

  const isLoading = loadingFolders || loadingNotes || loadingFiles
  const isEmpty = folders.length === 0 && notes.length === 0 && files.length === 0

  const handleTapFolder = useCallback(
    (folder: Folder) => navigateFolder(folder),
    [navigateFolder],
  )

  const handleLongPressFolder = useCallback(
    (folder: Folder) => {
      setEditingFolder(folder)
      setFolderSheetOpen(true)
    },
    [],
  )

  const handleTapNote = useCallback((note: Note) => {
    setEditingNote(note)
    setNoteSheetOpen(true)
  }, [])

  const handleTapFile = useCallback((_file: FileRecord) => {
    toast('File preview coming soon', 'info')
  }, [toast])

  const handleNewFolder = () => {
    setEditingFolder(null)
    setFolderSheetOpen(true)
  }

  const handleNewNote = () => {
    setEditingNote(null)
    setNoteSheetOpen(true)
  }

  return (
    <>
      <TopBar
        title="Filing Cabinet"
        right={
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" iconOnly onClick={handleNewFolder}>
              <FolderPlus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" iconOnly onClick={handleNewNote}>
              <StickyNote className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      <PageContainer>
        <div className="space-y-4">
          <FolderBreadcrumb />

          {user && (
            <SearchBar
              userId={user.id}
              onTapNote={handleTapNote}
              onTapFile={handleTapFile}
            />
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : isEmpty ? (
            <EmptyState
              icon={FileArchive}
              title="Nothing here yet"
              description="Create a folder, add a note, or upload a file."
              action={
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={handleNewFolder}>
                    <FolderPlus className="h-4 w-4" />
                    Folder
                  </Button>
                  <Button size="sm" onClick={handleNewNote}>
                    <Plus className="h-4 w-4" />
                    Note
                  </Button>
                </div>
              }
            />
          ) : (
            <>
              <FolderGrid
                folders={folders}
                onTapFolder={handleTapFolder}
                onLongPressFolder={handleLongPressFolder}
              />
              <FileGrid
                notes={notes}
                files={files}
                onTapNote={handleTapNote}
                onTapFile={handleTapFile}
              />

              <FileUploadZone folderId={currentFolderId} />
            </>
          )}
        </div>
      </PageContainer>

      <FolderSheet
        isOpen={folderSheetOpen}
        onClose={() => {
          setFolderSheetOpen(false)
          setEditingFolder(null)
        }}
        folder={editingFolder}
        parentId={currentFolderId}
      />

      <NoteSheet
        isOpen={noteSheetOpen}
        onClose={() => {
          setNoteSheetOpen(false)
          setEditingNote(null)
        }}
        note={editingNote}
        folderId={currentFolderId}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteFolderMutation.mutate(deleteTarget.id)}
        title="Delete folder"
        message={`Delete "${deleteTarget?.name}" and all its contents?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleteFolderMutation.isPending}
      />
    </>
  )
}
