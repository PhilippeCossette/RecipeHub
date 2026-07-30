import { Button } from '../ui/button'
import { logOutFN } from '#/db/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { IconLogout2 } from '@tabler/icons-react'

export default function LogOut({ className }: { className?: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleLogOut = async () => {
    await logOutFN()
    await queryClient.invalidateQueries({
      queryKey: ['currentUser'],
    })
    await router.invalidate()
  }
  return (
    <Button
      variant="destructive"
      className={`cursor-pointer ${className}`}
      onClick={handleLogOut}
    >
      <IconLogout2 stroke={2} />
      Logout
    </Button>
  )
}
