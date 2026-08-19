import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { TextareaErrorToolTip, InputErrorToolTip } from './input'
import type { ZodObject, ZodTypeAny } from 'zod'
import type { StandardSchemaV1 } from '@tanstack/react-form'

type Props = {
  form: any
  name: string
  label?: string
  type: string
  placeholder: string
  validator?: StandardSchemaV1 | ZodTypeAny
}

export default function TextInput({
  form,
  name,
  label,
  type,
  placeholder,
  validator,
}: Props) {
  return (
    <FieldGroup>
      <form.Field
        name={name}
        validators={{
          onChange: validator,
        }}
        children={(field: any) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field>
              {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

              {type === 'textarea' ? (
                <TextareaErrorToolTip
                  id={field.name}
                  className="bg-background"
                  placeholder={placeholder}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  isInvalid={isInvalid}
                  error={field.state.meta.errors[0]?.message}
                />
              ) : (
                <InputErrorToolTip
                  type={type}
                  id={field.name}
                  className="bg-background"
                  placeholder={placeholder}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (type === 'number') {
                      field.handleChange(
                        e.target.value === '' ? null : Number(e.target.value),
                      )
                    } else {
                      field.handleChange(e.target.value)
                    }
                  }}
                  isInvalid={isInvalid}
                  error={field.state.meta.errors[0]?.message}
                />
              )}
            </Field>
          )
        }}
      />
    </FieldGroup>
  )
}
