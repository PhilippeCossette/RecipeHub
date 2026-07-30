import { useRouter } from '@tanstack/react-router'

export function useGoBack() {
  const router = useRouter()

  const handleGoBack = () => {
    if (router.history.length <= 0) {
      router.navigate({ to: '/' })
    }

    router.history.back()
  }

  return handleGoBack
}
