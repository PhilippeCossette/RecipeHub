import { useEffect, useRef, useState } from 'react'
import { ImagePlus, RefreshCwIcon, XIcon } from 'lucide-react'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/components/ui/attachment'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

type CoverImageUploadProps = {
  file: File | null
  currentUrl: string | null
  onFileChange: (file: File | null) => void
  onRemove: () => void
  isUploading?: boolean
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function CoverImageUpload({
  file,
  currentUrl,
  onFileChange,
  onRemove,
  isUploading,
}: CoverImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(currentUrl)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, currentUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.')
      return
    }

    onFileChange(selected)
  }

  if (!previewUrl) {
    return (
      <label
        htmlFor="cover-image-upload"
        className="flex h-48 w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-transparent text-muted-foreground hover:bg-accent/50"
      >
        <ImagePlus className="h-6 w-6" />
        <span className="text-sm">Click to select cover image</span>
        <input
          id="cover-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </label>
    )
  }

  const fileName = file?.name ?? 'Cover image'

  return (
    <>
      <Dialog>
        <Attachment
          orientation="horizontal"
          size="default"
          state={isUploading ? 'uploading' : file ? 'idle' : 'done'}
          className="w-full max-w-sm"
        >
          <AttachmentMedia variant="image">
            <img src={previewUrl} alt="Cover preview" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{fileName}</AttachmentTitle>
            <AttachmentDescription>
              {file
                ? `${file.type.split('/')[1]?.toUpperCase()} · ${formatFileSize(file.size)}`
                : 'Current cover image'}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              type="button"
              aria-label="Change cover image"
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCwIcon />
            </AttachmentAction>
            <AttachmentAction
              type="button"
              aria-label="Remove cover image"
              onClick={() => {
                onFileChange(null)
                onRemove()
              }}
            >
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>

          {/* asChild merges DialogTrigger's onClick/props onto AttachmentTrigger's <button> */}
          <DialogTrigger asChild>
            <AttachmentTrigger aria-label={`Preview ${fileName}`} />
          </DialogTrigger>
        </Attachment>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{fileName}</DialogTitle>
          </DialogHeader>
          <img
            src={previewUrl}
            alt="Cover preview"
            className="w-full rounded-md object-contain"
          />
        </DialogContent>
      </Dialog>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  )
}
