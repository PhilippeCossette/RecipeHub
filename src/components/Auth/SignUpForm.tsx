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

import { useRouter } from '@tanstack/react-router'

import { signUpSchema } from '#/schema/auth'
import TextInput from '../ui/TextInput'
import { signUpFN } from '#/db/auth'
import { useQueryClient } from '@tanstack/react-query'

type SignUpProps = {
  switchAuthMode: () => void
}

export const SignUpForm = ({ switchAuthMode }: SignUpProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm({
    validators: {
      onChange: signUpSchema,
    },
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
    },
    onSubmit: async ({ value }) => {
      const result = await signUpFN({
        data: {
          email: value.email,
          password: value.password,
          confirmPassword: value.confirmPassword,
          username: value.username,
        },
      })

      if (!result.success) {
        toast.error(result.message || 'Sign up failed')
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
            Create your account
          </CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <TextInput
            form={form}
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
          />
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

          <TextInput
            form={form}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" type="submit">
            Sign Up
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{' '}
            <Button
              type="button"
              className="underline cursor-pointer"
              variant="link"
              onClick={switchAuthMode}
            >
              Sign in
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
