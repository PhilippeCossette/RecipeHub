import * as React from 'react'

import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleAlert } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Textarea } from './textarea'

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  )
}

type InputErrorToolTipProps = ComponentProps<typeof InputGroupInput> & {
  error?: string
  isInvalid?: boolean
}

export function InputErrorToolTip({
  className,
  type,
  placeholder,
  error,
  isInvalid,
  ...props
}: InputErrorToolTipProps) {
  return (
    <InputGroup className={cn('w-full', className)}>
      <InputGroupInput
        aria-invalid={isInvalid}
        {...props}
        placeholder={placeholder}
        type={type}
      />
      {isInvalid && (
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-9 h-9 p-0 hover:bg-transparent hover:scale-110 transition-all duration-200 animate-pulse text-red-400 hover:text-red-700"
              >
                <CircleAlert className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{error ?? 'No error message available'}</p>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

type TextareaErrorToolTipProps = ComponentProps<typeof Textarea> & {
  error?: string
  isInvalid?: boolean
}

export function TextareaErrorToolTip({
  className,
  error,
  isInvalid,
  ...props
}: TextareaErrorToolTipProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Textarea
        aria-invalid={isInvalid}
        className={cn(isInvalid && 'pr-10')}
        {...props}
      />
      {isInvalid && (
        <div className="absolute right-1 top-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-9 h-9 p-0 hover:bg-transparent hover:scale-110 transition-all duration-200 animate-pulse text-red-400 hover:text-red-700"
              >
                <CircleAlert className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{error ?? 'No error message available'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
