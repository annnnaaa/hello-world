import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { createNote } from '@/services/notes'
import { updateThought } from '@/services/thoughts'
import { noteKeys, thoughtKeys } from '@/lib/queryKeys'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/shared/TagInput'
import { useToast } from '@/components/ui/Toast'
import type { Thought } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(10000).optional(),
  tags: z.array(z.string()),
})

type FormData = z.infer<typeof schema>

interface ConvertToNoteProps {
  thought: Thought
  onSuccess: () => void
  onBack: () => void
}

export function ConvertToNote({ thought, onSuccess, onBack }: ConvertToNoteProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: thought.content.slice(0, 200),
      content: thought.content,
      tags: [],
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user) throw new Error('Not authenticated')
      const note = await createNote(user.id, {
        title: data.title,
        content: data.content || null,
        tags: data.tags,
      })
      await updateThought(thought.id, {
        status: 'converted',
        converted_to_type: 'note',
        converted_to_id: note.id,
      })
      return note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      queryClient.invalidateQueries({ queryKey: thoughtKeys.inbox() })
      toast('Converted to note', 'success')
      onSuccess()
    },
    onError: () => {
      toast('Failed to convert', 'error')
    },
  })

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <Input
          label="Title"
          error={errors.title?.message}
          autoFocus
          {...register('title')}
        />

        <Textarea
          label="Content"
          placeholder="Note content..."
          rows={6}
          {...register('content')}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</span>
              <TagInput tags={field.value} onChange={field.onChange} />
            </div>
          )}
        />

        <Button type="submit" fullWidth loading={mutation.isPending}>
          Create Note
        </Button>
      </form>
    </div>
  )
}
