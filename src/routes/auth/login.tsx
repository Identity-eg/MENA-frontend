import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/apis/auth/login'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background grid place-items-center p-6 relative">
      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            className="rounded-xl border bg-card p-3 hover:border-primary/30 transition-all"
            to="/"
          >
            <ShieldCheck className="h-6 w-6 text-primary" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Access your compliance intelligence portal
          </p>
        </div>

        <Card>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/auth/signup"
            className="text-primary font-semibold hover:underline"
            data-testid="link-signup"
          >
            Apply for Access
          </Link>
        </p>
      </div>
    </div>
  )
}

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid work email.'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

const LoginForm = () => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@menabusiness.com', password: 'password123' },
  })

  const loginMutation = useLogin()

  const onSubmit = async (data: LoginValues) => {
    await loginMutation.mutateAsync({ data })
  }

  const isSubmitting = form.formState.isSubmitting

  return (
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
            <FieldLabel htmlFor="login-email">Work Email</FieldLabel>
            <Input
              {...field}
              id="login-email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              aria-invalid={fieldState.invalid}
              data-testid="input-email"
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Link
                to="/auth/reset"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              {...field}
              id="login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={fieldState.invalid}
              data-testid="input-password"
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="w-full"
        size="lg"
        type="submit"
        disabled={isSubmitting}
        data-testid="button-next"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Sign In'}
        {!isSubmitting && <ArrowRight className="size-4" />}
      </Button>

      {loginMutation.isError && (
        <FieldError errors={[{ message: loginMutation.error.message }]} />
      )}
    </form>
  )
}
