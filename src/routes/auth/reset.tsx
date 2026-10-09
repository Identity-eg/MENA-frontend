import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Loader2, MailCheck } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Logo } from '@/components/brand/logo'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Input } from '@/components/ui/input'

import { useForgotPassword } from '@/apis/auth/forgot-password'
import { getErrorMessage } from '@/apis/base/error-handler'
import { businessEmailSchema } from '@/lib/business-email'
import { cn } from '@/lib/utils'

/** "Forgot password": request a reset link by email. The link opens /auth/reset-password?token=… */
export const Route = createFileRoute('/auth/reset')({
  pendingComponent: FullPageLoading,
  component: ForgotPasswordPage,
})

const GENERIC_SENT_MESSAGE =
  'If an account exists for that email, we have sent a link to reset your password.'

const forgotPasswordSchema = z.object({
  email: businessEmailSchema,
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const forgotPasswordMutation = useForgotPassword()

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await forgotPasswordMutation.mutateAsync(data)
    } catch {
      // Error is rendered below from mutation state.
    }
  }

  const isSubmitting = form.formState.isSubmitting
  const sentMessage = forgotPasswordMutation.isSuccess
    ? forgotPasswordMutation.data.message || GENERIC_SENT_MESSAGE
    : null

  return (
    <div className="min-h-screen bg-background grid place-items-center p-6 relative">
      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link to="/">
            <Logo size="lg" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Request a password reset link for your account
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {sentMessage ? (
              <div
                role="status"
                className="flex flex-col items-center gap-3 text-center"
              >
                <MailCheck className="h-8 w-8 text-primary" />
                <p className="text-sm text-muted-foreground">{sentMessage}</p>
              </div>
            ) : (
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="forgot-email">
                        Business email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="forgot-email"
                        type="email"
                        placeholder="name@company.com"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        data-testid="input-email"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {forgotPasswordMutation.isError && (
                  <FieldError
                    errors={[
                      {
                        message: getErrorMessage(
                          forgotPasswordMutation.error,
                          'Could not send the reset link.',
                        ).message,
                      },
                    ]}
                  />
                )}

                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            )}
            <Link
              to="/auth/login"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full mt-4',
              )}
            >
              Back to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
