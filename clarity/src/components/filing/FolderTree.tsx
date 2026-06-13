import { useState } from 'react'
import { Folder, FolderOpen, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Folder as FolderType } from '@/types'

interface FolderTreeProps {
  folders: FolderType[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAddFolder: (parentId: string | null) => void
}

function FolderNode({
  folder,
  selectedId,
  onSelect,
  onAddFolder,
  depth,
}: {
  folder: FolderType
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAddFolder: (parentId: string | null) => void
  depth: number
}) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = (folder.children?.length ?? 0) > 0
  const isSelected = selectedId === folder.id

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-colors group',
          isSelected ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
        )}
        style={{ paddingLeft: `${(depth * 12) + 12}px` }}
      >
        <button
          onClick={() => hasChildren && setExpanded(e => !e)}
          className="shrink-0 text-slate-400"
        >
          {hasChildren
            ? (expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)
            : <div className="w-3.5" />}
        </button>

        <button
          onClick={() => onSelect(folder.id)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          {isSelected || expanded
            ? <FolderOpen className="w-4 h-4 shrink-0" style={folder.color ? { color: folder.color } : undefined} />
            : <Folder className="w-4 h-4 shrink-0" style={folder.color ? { color: folder.color } : undefined} />}
          <span className="text-sm font-medium truncate">{folder.name}</span>
        </button>

        <button
          onClick={() => onAddFolder(folder.id)}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-brand-500 transition-all"
          aria-label="Add subfolder"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {expanded && hasChildren && folder.children!.map(child => (
        <FolderNode
          key={child.id}
          folder={child}
          selectedId={selectedId}
          onSelect={onSelect}
          onAddFolder={onAddFolder}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export function FolderTree({ folders, selectedId, onSelect, onAddFolder }: FolderTreeProps) {
  return (
    <div className="py-1">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex items-center gap-2 w-full py-2 px-3 rounded-xl text-left transition-colors',
          selectedId === null ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
        )}
      >
        <Folder className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">All files</span>
      </button>

      {folders.map(folder => (
        <FolderNode
          key={folder.id}
          folder={folder}
          selectedId={selectedId}
          onSelect={onSelect}
          onAddFolder={onAddFolder}
          depth={0}
        />
      ))}

      <button
        onClick={() => onAddFolder(null)}
        className="flex items-center gap-2 w-full py-2 px-3 mt-1 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        New folder
      </button>
    </div>
  )
}
