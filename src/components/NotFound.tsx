import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { ClientOnly } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { useGoBack } from '#/hooks/useGoBack'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRedirect } from '#/hooks/useRedirect'

type NotFoundProps = {
  title?: string
  message?: string
  type?: 'recipe' | 'page'
  btnTitle?: string
  withBackButton?: boolean
  actionVariants?: 'default' | 'redirect'
  url?: string
}

export default function NotFound({
  title,
  message,
  type,
  btnTitle = 'Back',
  withBackButton = true,
  actionVariants = 'default',
  url,
}: NotFoundProps) {
  const goBack = useGoBack()
  const redirect = useRedirect(url || '/')
  const action = actionVariants === 'default' ? goBack : redirect

  const animationSrc =
    type === 'recipe'
      ? '/animations/nothing.lottie'
      : '/animations/Cooking.lottie'
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center">
      <ClientOnly fallback={<Spinner scale="3" />}>
        <DotLottieReact
          src={animationSrc}
          loop
          autoplay
          className="aspect-auto max-w-full"
        />
      </ClientOnly>

      <h1 className="font-semibold text-2xl">{title || 'Not Found'}</h1>
      <p>{message || 'The page you are looking for does not exist.'}</p>
      {withBackButton && (
        <Button variant="default" onClick={action} className="mt-4">
          <IconArrowLeft />
          {btnTitle}
        </Button>
      )}
    </div>
  )
}
