import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Link,
  createFileRoute,
  useRouteContext,
} from '@tanstack/react-router'
import { CheckCircle2, Clock } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError } from '@/components/ui/field'

export const Route = createFileRoute('/portal')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Portal — Coming Soon | Ident-ity' },
      {
        name: 'description',
        content:
          'The Ident-ity Portal: request submission, status tracking, and delivery in one place. Launching soon.',
      },
    ],
  }),
  component: PortalPage,
})

const notifySchema = z.object({
  email: z.email('Please enter a valid email address.'),
})

type NotifyValues = z.infer<typeof notifySchema>

function PortalPage() {
  const { user } = useRouteContext({ from: '__root__' })
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<NotifyValues>({
    resolver: zodResolver(notifySchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (_data: NotifyValues) => {
    // TODO(backend): feed the shared notify-me list (FR9) — mocked for now.
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <div className="grid size-14 place-items-center rounded-2xl border border-brand-cyan/30 bg-brand-mist text-brand-navy">
            <Clock className="size-6" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Ident-ity Portal
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Request submission, status tracking, and delivery in one place —
            a closed-cycle online portal with no email chains. Launching
            soon.
          </p>

          <div className="mt-8 w-full max-w-sm">
            {submitted ? (
              <div
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-brand-mist/60 p-6"
                data-testid="portal-notify-success"
              >
                <CheckCircle2 className="size-6 text-brand-cyan" />
                <p className="text-sm font-medium text-brand-navy">
                  You're on the list — we'll email you at launch.
                </p>
              </div>
            ) : (
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3 sm:flex-row sm:items-start"
                noValidate
              >
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={!!fieldState.error}
                      className="flex-1"
                    >
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@company.com"
                        aria-invalid={!!fieldState.error}
                        aria-label="Email address"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Notify Me
                </Button>
              </form>
            )}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Need a service today?{' '}
            <Link
              to="/lets-talk"
              className="font-semibold text-brand-navy hover:text-brand-cyan"
            >
              Contact us
            </Link>
          </p>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
