import { useState } from 'react'
import { useFiling } from '@/hooks/useFiling'
import { Header } from '@/components/layout/Header'
import { FolderTree } from '@/components/filing/FolderTree'
import { DocumentCard } from '@/components/filing/DocumentCard'
import { DocumentForm } from '@/components/filing/DocumentForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FolderOpen, Plus, Search, Upload, FileText, Folder } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

export function FilingPage() {
  const { documents, folders, loading, currentFolder, setCurrentFolder, addFolder, uploadFile, buildTree, docsInFolder, search } = useFiling()
  const { showToast } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [addDocOpen, setAddDocOpen] = useState(false)
  const [addFolderOpen, setAddFolderOpen] = useState(false)
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [folderSidebarOpen, setFolderSidebarOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const tree = buildTree()
  const displayDocs = searchQuery ? search(searchQuery) : docsInFolder(currentFolder)

  const currentFolderName = currentFolder
    ? folders.find(f => f.id === currentFolder)?.name ?? 'Folder'
    : 'All files'

  const handleAddFolder = (parentId: string | null) => {
    setNewFolderParent(parentId)
    setNewFolderName('')
    setAddFolderOpen(true)
    setFolderSidebarOpen(false)
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    await addFolder(newFolderName.trim(), newFolderParent)
    showToast('Folder created', 'success')
    setAddFolderOpen(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const result = await uploadFile(file, currentFolder)
    setUploading(false)
    if (result) showToast('File uploaded', 'success')
    else showToast('Upload failed — check Supabase storage settings', 'error')
    e.target.value = ''
  }

  if (loading) {
    return (
      <div>
        <Header title="Filing Cabinet" />
        <LoadingSpinner className="mt-8" />
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Filing Cabinet"
        subtitle={currentFolderName}
        right={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFolderSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Folders"
            >
              <Folder className="w-5 h-5" />
            </button>
            <button
              onClick={() => setAddDocOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Add note"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="px-4 pt-4 space-y-4 pb-4">
        <Input
          placeholder="Search documents and notes…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <div className="flex gap-2">
          <label className="flex-1">
            <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm font-medium cursor-pointer hover:border-brand-400 hover:text-brand-500 transition-colors ${uploading ? 'opacity-50 cursor-wait' : ''}`}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : 'Upload file'}
            </div>
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          <Button variant="secondary" onClick={() => setAddDocOpen(true)}>
            <FileText className="w-4 h-4" />
            New note
          </Button>
        </div>

        {displayDocs.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="w-8 h-8" />}
            title={searchQuery ? 'No results' : 'Nothing here yet'}
            description={searchQuery ? 'Try a different search term' : 'Upload files or create notes to fill this space.'}
          />
        ) : (
          <div className="space-y-3">
            {displayDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
          </div>
        )}
      </div>

      <Modal open={folderSidebarOpen} onClose={() => setFolderSidebarOpen(false)} title="Folders" size="sm">
        <div className="p-3">
          <FolderTree
            folders={tree}
            selectedId={currentFolder}
            onSelect={(id) => { setCurrentFolder(id); setFolderSidebarOpen(false) }}
            onAddFolder={handleAddFolder}
          />
        </div>
      </Modal>

      <Modal open={addFolderOpen} onClose={() => setAddFolderOpen(false)} title="New folder" size="sm">
        <div className="p-5 space-y-4">
          <Input
            label="Folder name"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="e.g. Finance"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setAddFolderOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="flex-1">Create</Button>
          </div>
        </div>
      </Modal>

      <DocumentForm
        open={addDocOpen}
        onClose={() => setAddDocOpen(false)}
        defaultFolderId={currentFolder}
      />
    </div>
  )
}
