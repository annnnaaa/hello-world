import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/shared/TagInput'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/stores/authStore'
import { createNote, updateNote, deleteNote } from '@/services/notes'
import { noteKeys } from '@/lib/queryKeys'
import type { Note } from '@/types'

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(10000).nullable(),
  tags: z.array(z.string()),
})

type NoteFormData = z.infer<typeof noteSchema>

interface NoteSheetProps {
  isOpen: boolean
  onClose: () => void
  note?: Note | null
  folderId: string | null
}

export function NoteSheet({ isOpen, onClose, note, folderId }: NoteSheetProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const isEditing = !!note

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: null,
      tags: [],
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        title: note?.title ?? '',
        content: note?.content ?? null,
        tags: note?.tags ?? [],
      })
    }
  }, [isOpen, note, reset])

  const createMutation = useMutation({
    mutationFn: (data: NoteFormData) => {
      if (!user) throw new Error('Not authenticated')
      return createNote(user.id, {
        title: data.title,
        content: data.content,
        tags: data.tags,
        folder_id: folderId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      toast('Note created', 'success')
      onClose()
    },
    onError: () => {
      toast('Failed to create note', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: NoteFormData) => {
      if (!note) throw new Error('No note to update')
      return updateNote(note.id, {
        title: data.title,
        content: data.content,
        tags: data.tags,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      toast('Note updated', 'success')
      onClose()
    },
    onError: () => {
      toast('Failed to update note', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!note) throw new Error('No note to delete')
      return deleteNote(note.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      toast('Note deleted', 'success')
      onClose()
    },
    onError: () => {
      toast('Failed to delete note', 'error')
    },
  })

  const isLoading =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const onSubmit = (data: NoteFormData) => {
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
      title={isEditing ? 'Edit Note' : 'New Note'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Title"
          placeholder="Note title"
          error={errors.title?.message}
          autoFocus
          {...register('title')}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Textarea
              label="Content"
              placeholder="Write your note..."
              rows={6}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value || null)}
              error={errors.content?.message}
            />
          )}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tags
              </span>
              <TagInput tags={field.value} onChange={field.onChange} />
            </div>
          )}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          {isEditing ? 'Save Changes' : 'Create Note'}
        </Button>

        {isEditing && (
          <Button
            type="button"
            variant="danger"
            fullWidth
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            <Trash2 className="h-4 w-4" />
            Delete Note
          </Button>
        )}
      </form>
    </BottomSheet>
  )
}
