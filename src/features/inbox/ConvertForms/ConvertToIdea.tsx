import { useForm } from 'react-hook-form'
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
import { useToast } from '@/components/ui/Toast'
import type { Thought } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(10000).optional(),
})

type FormData = z.infer<typeof schema>

interface ConvertToIdeaProps {
  thought: Thought
  onSuccess: () => void
  onBack: () => void
}

export function ConvertToIdea({ thought, onSuccess, onBack }: ConvertToIdeaProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: thought.content.slice(0, 200),
      content: thought.content,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user) throw new Error('Not authenticated')
      const note = await createNote(user.id, {
        title: data.title,
        content: data.content || null,
        tags: ['idea'],
        pinned: true,
      })
      await updateThought(thought.id, {
        status: 'converted',
        converted_to_type: 'idea',
        converted_to_id: note.id,
      })
      return note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      queryClient.invalidateQueries({ queryKey: thoughtKeys.inbox() })
      toast('Saved as idea', 'success')
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
          label="Idea title"
          error={errors.title?.message}
          autoFocus
          {...register('title')}
        />

        <Textarea
          label="Details"
          placeholder="Flesh out the idea (optional)"
          rows={6}
          {...register('content')}
        />

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Ideas are saved as pinned notes with an #idea tag.
        </p>

        <Button type="submit" fullWidth loading={mutation.isPending}>
          Save Idea
        </Button>
      </form>
    </div>
  )
}
