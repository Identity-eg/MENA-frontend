import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { useRegister } from '@/apis/auth/register'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

const signupSchema = z.object({
  name: z
    .string({ error: 'Full name is required' })
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .email('Please enter a valid work email.')
    .min(1, 'Email is required'),
  companyName: z
    .string({ error: 'Company name is required' })
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  roleInCompany: z.string().optional(),
  phone: z
    .string({ error: 'Phone number is required' })
    .min(1, 'Phone number is required')
    .min(6, 'Please enter a valid phone number'),
})

type SignupValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      companyName: '',
      roleInCompany: '',
      phone: '',
    },
    mode: 'onTouched',
  })

  const registerMutation = useRegister()

  const onSubmit = (data: SignupValues) => {
    registerMutation.mutate(data)
  }

  const isSubmitting = form.formState.isSubmitting || registerMutation.isPending

  return (
    <div className="min-h-screen bg-background grid place-items-center p-6 relative">
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="flex flex-col py-6 items-center">
          <Link
            className="rounded-xl border bg-card p-3 mb-2 hover:border-primary/30 transition-all w-fit"
            to="/"
          >
            <ShieldCheck className="h-6 w-6 text-primary" />
          </Link>
          <CardTitle className="text-2xl font-semibold">
            Create Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Apply for access to the CompliancePortal.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="signup-fullName" required>
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-fullName"
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-invalid={!!fieldState.error}
                    data-testid="input-fullname"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="signup-email" required>
                    Work Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    placeholder="john@company.com"
                    autoComplete="email"
                    aria-invalid={!!fieldState.error}
                    data-testid="input-email"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="companyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="signup-companyName" required>
                    Company Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-companyName"
                    placeholder="Acme Inc."
                    autoComplete="organization"
                    aria-invalid={!!fieldState.error}
                    data-testid="input-company-name"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="roleInCompany"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="signup-roleInCompany">
                    Role in Company
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-roleInCompany"
                    placeholder="Compliance Officer"
                    autoComplete="organization-title"
                    data-testid="input-role"
                  />
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="signup-phone" required>
                    Phone Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    autoComplete="tel"
                    aria-invalid={!!fieldState.error}
                    data-testid="input-phone"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
                'Submit Application'
              )}
              {!isSubmitting && <ArrowRight className="size-4" />}
            </Button>

            {registerMutation.isError && (
              <FieldError
                errors={[{ message: registerMutation.error.message }]}
              />
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t p-6 bg-muted/10">
          <p className="text-xs text-center text-muted-foreground px-4">
            By submitting, you agree to our terms. Your application will be
            reviewed by our compliance team.
          </p>
          <div className="text-sm text-center">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-primary font-semibold hover:underline"
              data-testid="link-login"
            >
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
