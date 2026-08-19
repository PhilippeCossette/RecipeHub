'use client'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { loginSchema } from '#/schema/auth'
import TextInput from '../ui/TextInput'
import { logInFN } from '#/db/auth'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

type LoginProps = {
  switchAuthMode: () => void
}

export const LoginForm = ({ switchAuthMode }: LoginProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm({
    validators: {
      onChange: loginSchema,
    },
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const result = await logInFN({
        data: {
          email: value.email,
          password: value.password,
        },
      })

      if (!result.success) {
        toast.error(result.message || 'Login failed')
        return
      }
      await queryClient.invalidateQueries({
        queryKey: ['currentUser'],
      })
      await router.invalidate()
      router.navigate({ to: '/' })
    },
  })
  return (
    <Card className="max-w-162.5 mx-auto w-full">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-extrabold">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <TextInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <TextInput
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" type="submit">
            Sign In
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{' '}
            <Button
              onClick={switchAuthMode}
              type="button"
              className="underline cursor-pointer"
              variant="link"
            >
              Sign up
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
