import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/stores/authStore'
import { createFolder, updateFolder } from '@/services/folders'
import { folderKeys } from '@/lib/queryKeys'
import { cn } from '@/lib/utils'
import type { Folder } from '@/types'

const COLOR_SWATCHES = [
  null,
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
] as const

const folderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: z.string().nullable(),
  icon: z.string().nullable(),
})

type FolderFormData = z.infer<typeof folderSchema>

interface FolderSheetProps {
  isOpen: boolean
  onClose: () => void
  folder?: Folder | null
  parentId: string | null
}

export function FolderSheet({ isOpen, onClose, folder, parentId }: FolderSheetProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const isEditing = !!folder

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: '',
      color: null,
      icon: null,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: folder?.name ?? '',
        color: folder?.color ?? null,
        icon: folder?.icon ?? null,
      })
    }
  }, [isOpen, folder, reset])

  const createMutation = useMutation({
    mutationFn: (data: FolderFormData) => {
      if (!user) throw new Error('Not authenticated')
      return createFolder(user.id, {
        name: data.name,
        color: data.color,
        icon: data.icon,
        parent_id: parentId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
      toast('Folder created', 'success')
      onClose()
    },
    onError: () => {
      toast('Failed to create folder', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: FolderFormData) => {
      if (!folder) throw new Error('No folder to update')
      return updateFolder(folder.id, {
        name: data.name,
        color: data.color,
        icon: data.icon,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
      toast('Folder updated', 'success')
      onClose()
    },
    onError: () => {
      toast('Failed to update folder', 'error')
    },
  })

  const isLoading = createMutation.isPending || updateMutation.isPending

  const onSubmit = (data: FolderFormData) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Folder' : 'New Folder'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Folder Name"
          placeholder="e.g., Work Documents"
          error={errors.name?.message}
          autoFocus
          {...register('name')}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Color
              </span>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color ?? 'none'}
                    type="button"
                    onClick={() => field.onChange(color)}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2',
                      'dark:focus-visible:ring-offset-slate-800',
                      field.value === color
                        ? 'border-slate-900 dark:border-white scale-110'
                        : 'border-transparent',
                    )}
                    style={{
                      backgroundColor: color ?? undefined,
                    }}
                    aria-label={color ? `Color ${color}` : 'No color'}
                  >
                    {color === null && (
                      <span
                        className={cn(
                          'flex h-full w-full items-center justify-center rounded-full',
                          'bg-slate-200 dark:bg-slate-600 text-xs text-slate-500 dark:text-slate-400',
                        )}
                      >
                        --
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          {isEditing ? 'Save Changes' : 'Create Folder'}
        </Button>
      </form>
    </BottomSheet>
  )
}
