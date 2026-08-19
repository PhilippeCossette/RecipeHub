import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import type { Dispatch, SetStateAction } from 'react'

type DrawerControllerProps = {
  onClick?: () => void
  label: string
  title?: string
  tooltipContent: string
  icon?: React.ReactNode
  children: React.ReactNode
  customBoolean?: boolean
  customOnChange?: Dispatch<SetStateAction<boolean>>
}

export default function DrawerController({
  onClick,
  label,
  title,
  tooltipContent,
  icon,
  children,
  customBoolean,
  customOnChange,
}: DrawerControllerProps) {
  return (
    <Sheet open={customBoolean} onOpenChange={customOnChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button onClick={onClick}>
              {icon || <Plus className="h-4 w-4" />}
              {label && <span className="ml-2">{label}</span>}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title || ''}</SheetTitle>
        </SheetHeader>

        <div className="p-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
