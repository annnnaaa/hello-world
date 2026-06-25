import type { Folder } from '@/types'
import { FolderCard } from './FolderCard'

interface FolderGridProps {
  folders: Folder[]
  onTapFolder: (folder: Folder) => void
  onLongPressFolder: (folder: Folder) => void
}

export function FolderGrid({ folders, onTapFolder, onLongPressFolder }: FolderGridProps) {
  if (folders.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onTap={onTapFolder}
          onLongPress={onLongPressFolder}
        />
      ))}
    </div>
  )
}
