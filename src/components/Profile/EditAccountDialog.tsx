import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { IconSettings } from '@tabler/icons-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Separator } from '../ui/separator'
import TextInput from '../ui/TextInput'
import {
  updateEmailSchema,
  updatePasswordSchema,
  updateUsernameSchema,
  type CurrentUser,
} from '#/schema/auth'
import {
  updateEmailMutation,
  updatePasswordMutation,
  updateUsernameMutation,
} from '#/queries/user'
import { useRouter } from '@tanstack/react-router'

export default function EditAccountDialog({ user }: { user: CurrentUser }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconSettings stroke={2} />
          Edit account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>
            Update your username, email, or password. Changing your email
            requires confirming it via a link sent to the new address.
          </DialogDescription>
        </DialogHeader>

        <UsernameForm currentUsername={user?.username ?? ''} />

        <Separator />

        <EmailForm currentEmail={user?.email ?? ''} />

        <Separator />

        <PasswordForm />
      </DialogContent>
    </Dialog>
  )
}

function UsernameForm({ currentUsername }: { currentUsername: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    ...updateUsernameMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      await router.invalidate()
      toast.success('Username updated.')
    },
    onError: (error) => {
      console.error('Error updating username:', error)
      toast.error(error.message || 'Failed to update username')
    },
  })

  const form = useForm({
    validators: { onChange: updateUsernameSchema },
    defaultValues: { username: currentUsername },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
  })

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <TextInput
        form={form}
        name="username"
        label="Username"
        type="text"
        validator={updateUsernameSchema.shape.username}
        placeholder="Your username"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update username'}
      </Button>
    </form>
  )
}

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    ...updateEmailMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      toast.success('Check your new email inbox to confirm the change.')
    },
    onError: (error) => {
      console.error('Error updating email:', error)
      toast.error(error.message || 'Failed to update email')
    },
  })

  const form = useForm({
    validators: { onChange: updateEmailSchema },
    defaultValues: { email: currentEmail },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
  })

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <TextInput
        form={form}
        name="email"
        label="Email address"
        type="email"
        validator={updateEmailSchema.shape.email}
        placeholder="you@example.com"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update email'}
      </Button>
    </form>
  )
}

function PasswordForm() {
  const { mutate, isPending } = useMutation({
    ...updatePasswordMutation(),
    onSuccess: () => {
      toast.success('Password updated successfully.')
      form.reset()
    },
    onError: (error) => {
      console.error('Error updating password:', error)
      toast.error(error.message || 'Failed to update password')
    },
  })

  const form = useForm({
    validators: { onChange: updatePasswordSchema },
    defaultValues: { password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
  })

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <TextInput
        form={form}
        name="password"
        label="New password"
        type="password"
        placeholder="At least 8 characters"
      />
      <TextInput
        form={form}
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Re-enter your new password"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update password'}
      </Button>
    </form>
  )
}
