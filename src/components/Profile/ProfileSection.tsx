import { IconHeart, IconCalendar } from '@tabler/icons-react'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'

import { Route as RootRoute } from '#/routes/__root'
import LogOut from '../Button/LogOut'
import { useSuspenseQuery } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { getLikedRecipeQuery } from '#/queries/user'
import { ThemeButton } from '../Button/ThemeButton'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function ProfileSection() {
  const { user } = RootRoute.useRouteContext()

  if (!user) throw notFound()

  const { data } = useSuspenseQuery(getLikedRecipeQuery(user.id))

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      {/* Header */}

      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
          <Avatar className="size-24 sm:size-20">
            <AvatarFallback className="text-xl">
              {getInitials(user?.username ?? 'User')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h1 className="text-2xl font-semibold text-card-foreground">
                {user?.username}
              </h1>
              {user?.role === 'admin' && (
                <Badge className=" rounded-full mb-2 md:mb-0 bg-accent text-accent-foreground hover:bg-accent">
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {user?.email || 'No Email Provided'}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <ThemeButton />
            <LogOut />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center  gap-1 py-6 text-center">
            <span className="text-muted-foreground">
              <IconHeart stroke={2} className="size-4" />
            </span>
            <span className="text-2xl font-semibold text-card-foreground">
              {data.count}
            </span>
            <span className="text-xs text-muted-foreground">Saved recipes</span>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center  gap-1 py-6 text-center">
            <span className="text-muted-foreground">
              <IconCalendar stroke={2} className="size-4" />
            </span>
            <span className="text-2xl font-semibold text-card-foreground">
              {user.created_at &&
                new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
            </span>
            <span className="text-xs text-muted-foreground">Member since</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
