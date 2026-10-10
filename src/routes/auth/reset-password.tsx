import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useHydrated } from '@tanstack/react-router'
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { PasswordInput } from '@/components/ui/password-input'

import { useResetPassword } from '@/apis/auth/reset-password'
import { getErrorMessage } from '@/apis/base/error-handler'

/** Target of the emailed reset link: `${FRONTEND_URL}/auth/reset-password?token=…` */
export const Route = createFileRoute('/auth/reset-password')({
  pendingComponent: FullPageLoading,
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string('Token is required').min(1, 'Token is required'),
  }),
})

/** Mirrors the backend rules (min 8, upper, lower, number). */
const resetPasswordSchema = z
  .object({
    password: z
      .string('Password is required')
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
      .string('Please confirm your password')
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

function RouteComponent() {
  const { token } = Route.useSearch()
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const resetPasswordMutation = useResetPassword()

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await resetPasswordMutation.mutateAsync({
        password: data.password,
        token,
      })
    } catch {
      // Error is rendered below from mutation state.
    }
  }

  const isSubmitting = form.formState.isSubmitting

  // Until hydration the browser would submit natively; keep Submit disabled.

  const hydrated = useHydrated()

  return (
    <div className="min-h-screen bg-background grid place-items-center p-6 relative">
      <div className="absolute inset-0 app-grid opacity-[0.2]" />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center py-6">
          <div className="mx-auto size-12 rounded-xl border bg-card grid place-items-center mb-4">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Choose a New Password</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Set a new password for your Ident-ity account.
          </p>
        </CardHeader>
        <CardContent>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="reset-password">New Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="reset-password"
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
                  <FieldLabel htmlFor="reset-confirm">
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="reset-confirm"
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

            {resetPasswordMutation.isError && (
              <div className="space-y-1">
                <FieldError
                  errors={[
                    {
                      message: getErrorMessage(
                        resetPasswordMutation.error,
                        'Could not reset your password.',
                      ).message,
                    },
                  ]}
                />
                <p className="text-xs text-muted-foreground">
                  If your link has expired,{' '}
                  <Link
                    to="/auth/reset"
                    className="text-primary font-medium hover:underline"
                  >
                    request a new one
                  </Link>
                  .
                </p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!hydrated || isSubmitting}
              data-testid="button-submit"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center w-full justify-center gap-2 text-[10px] font-bold text-muted-foreground/60 mx-auto border-t">
          <ShieldCheck className="size-3" />
          Ident-ity Secure Entry
        </CardFooter>
      </Card>
    </div>
  )
}
