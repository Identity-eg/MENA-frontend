import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Lock, ShieldCheck } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useSetupPassword } from '@/apis/auth/setup-password'

export const Route = createFileRoute('/auth/setup-password')({
  pendingComponent: FullPageLoading,
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
})

const setupPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SetupPasswordValues = z.infer<typeof setupPasswordSchema>

function RouteComponent() {
  const { token } = Route.useSearch()
  const form = useForm<SetupPasswordValues>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const setupPasswordMutation = useSetupPassword()

  const onSubmit = (data: SetupPasswordValues) => {
    setupPasswordMutation.mutate({
      password: data.password,
      token,
    })
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="min-h-screen bg-background grid place-items-center p-6 relative">
      <div className="absolute inset-0 app-grid opacity-[0.2]" />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center py-6">
          <div className="mx-auto size-12 rounded-xl border bg-card grid place-items-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Setup Password</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your registration and secure your account.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="setup-password">New Password</FieldLabel>
                  <Input
                    {...field}
                    id="setup-password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!fieldState.error}
                    data-testid="input-password"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="setup-confirm">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="setup-confirm"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!fieldState.error}
                    data-testid="input-confirm"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {setupPasswordMutation.isError && (
              <FieldError
                errors={[{ message: setupPasswordMutation.error.message }]}
              />
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center w-full justify-center gap-2 text-[10px] font-bold text-muted-foreground/60 mx-auto border-t">
          <ShieldCheck className="size-3" />
          CompliancePortal Secure Entry
        </CardFooter>
      </Card>
    </div>
  )
}
