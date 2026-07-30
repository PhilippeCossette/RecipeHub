import { useNavigate } from '@tanstack/react-router'

export const useRedirect = (url: string) => {
  const navigate = useNavigate()

  const redirect = () => {
    if (!url) return

    navigate({ to: url })
  }

  return redirect
}
