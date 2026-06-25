import { BottomSheet } from '@/components/ui/BottomSheet'
import { TaskForm } from './TaskForm'
import type { Task } from '@/types'

interface TaskSheetProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
}

export function TaskSheet({ isOpen, onClose, task }: TaskSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'New Task'}
    >
      <TaskForm
        key={task?.id ?? 'new'}
        task={task}
        onSuccess={onClose}
      />
    </BottomSheet>
  )
}
