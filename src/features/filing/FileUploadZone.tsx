import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/stores/authStore'
import { uploadFile } from '@/services/files'
import { fileKeys } from '@/lib/queryKeys'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

interface FileUploadZoneProps {
  folderId: string | null
}

export function FileUploadZone({ folderId }: FileUploadZoneProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      if (!user) throw new Error('Not authenticated')
      return uploadFile(user.id, folderId, file)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.all })
      toast('File uploaded', 'success')
    },
    onError: () => {
      toast('Failed to upload file', 'error')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset the input so the same file can be re-selected
    e.target.value = ''

    if (file.size > MAX_FILE_SIZE) {
      toast('File must be under 50 MB', 'error')
      return
    }

    uploadMutation.mutate(file)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
      <Button
        variant="secondary"
        fullWidth
        loading={uploadMutation.isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Upload File
      </Button>
    </>
  )
}
