import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { resendVerificationEmailMutation } from '#/queries/user'
import { verifyEmailSearchSchema } from '#/schema/search'
import LogOut from '#/components/Button/LogOut'

export const Route = createFileRoute('/verify-email')({
  component: RouteComponent,
  validateSearch: verifyEmailSearchSchema,
  beforeLoad: async ({ context, search }) => {
    if (context.user?.emailVerified) {
      throw redirect({ to: '/' })
    }
    // No active session (e.g. just signed up with "Confirm email" required)
    // and no email to show — nothing useful to render here.
    if (!context.user && !search.email) {
      throw redirect({ to: '/auth' })
    }
  },
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const { email: emailParam } = Route.useSearch()
  const router = useRouter()
  const queryClient = useQueryClient()

  const displayEmail = user?.email ?? emailParam ?? null

  const { mutate: resend, isPending } = useMutation({
    ...resendVerificationEmailMutation(),
    onSuccess: () => {
      toast.success('Verification email sent. Check your inbox.')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to resend verification email')
    },
  })

  const handleContinue = async () => {
    if (!user) {
      // No session yet — the confirmation link doesn't log this app in on
      // its own, so the only way forward is a normal sign-in now that the
      // account is confirmed.
      router.navigate({ to: '/auth' })
      return
    }
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    await router.invalidate()
  }

  return (
    <main className="pageLayout flex min-h-[70vh] items-center justify-center">
      <Card className="max-w-125 mx-auto w-full">
        <CardHeader className="flex flex-col items-center text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-6" />
          </span>
          <CardTitle className="text-2xl font-bold">
            Verify your email
          </CardTitle>
          <CardDescription>
            {displayEmail ? (
              <>
                We sent a confirmation link to{' '}
                <span className="font-medium text-foreground">
                  {displayEmail}
                </span>
                . Click the link, then come back and sign in.
              </>
            ) : (
              'We sent a confirmation link to your email. Click it, then come back and sign in.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            {user
              ? "Already clicked the link? Refresh your status below."
              : "Already clicked the link? Sign in below — you're not logged in yet, confirming just unlocks your account."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleContinue}>
            {user ? "I've verified — continue" : 'Go to sign in'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => displayEmail && resend({ email: displayEmail })}
            disabled={isPending || !displayEmail}
          >
            {isPending ? 'Sending...' : 'Resend verification email'}
          </Button>
          {user && <LogOut className="w-full" />}
        </CardFooter>
      </Card>
    </main>
  )
}
