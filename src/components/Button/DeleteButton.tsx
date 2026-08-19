import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Spinner } from '../ui/spinner'
import type { Dispatch, SetStateAction } from 'react'

type DeleteButtonProps = {
  isDeleting: boolean
  handleDeleteClick: () => void
  name?: string
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function DeleteButton({
  isDeleting,
  handleDeleteClick,
  name,
  open,
  onOpenChange,
}: DeleteButtonProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            {name || 'recipe'} from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteClick} disabled={isDeleting}>
            Continue {isDeleting && <Spinner />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
