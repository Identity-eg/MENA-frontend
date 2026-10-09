import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useRouteContext } from '@tanstack/react-router'
import { CheckCircle2, Clock } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { MarketingShell } from '@/components/marketing/marketing-shell'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Input } from '@/components/ui/input'

import { businessEmailSchema } from '@/lib/business-email'

export const Route = createFileRoute('/portal')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Portal, coming soon | Ident-ity' },
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
  email: businessEmailSchema,
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
    <MarketingShell user={user}>
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
        <div className="grid size-14 place-items-center rounded-2xl border border-border bg-brand-mist text-brand-navy">
          <Clock className="size-6" />
        </div>

        <h1 className="mt-8 text-4xl font-semibold leading-[0.98] tracking-display text-brand-navy sm:text-5xl">
          Ident-ity Portal
        </h1>
        <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
          Request submission, status tracking, and delivery in one place. A
          closed-cycle portal with no email chains, launching soon.
        </p>

        <div className="mt-10 w-full max-w-sm">
          {submitted ? (
            <div
              className="flex flex-col items-center gap-2 rounded-2xl border border-brand-cyan-ink/25 bg-brand-cyan/10 p-6"
              data-testid="portal-notify-success"
            >
              <CheckCircle2 className="size-6 text-brand-cyan-ink" />
              <p className="text-sm font-medium text-brand-navy">
                You are on the list. We will email you at launch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 text-start sm:flex-row sm:items-start"
              noValidate
            >
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} className="flex-1">
                    <label
                      htmlFor="portal-notify-email"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Work email
                    </label>
                    <Input
                      {...field}
                      id="portal-notify-email"
                      type="email"
                      placeholder="you@company.com"
                      aria-invalid={!!fieldState.error}
                      className="h-10 rounded-lg"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="mt-[22px] h-10 rounded-lg bg-brand-navy px-5 font-semibold text-white hover:bg-brand-navy/90"
              >
                Notify me
              </Button>
            </form>
          )}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Need a service today?{' '}
          <Link
            to="/lets-talk"
            className="font-medium text-brand-cyan-ink underline-offset-4 hover:underline"
          >
            Talk to us
          </Link>
        </p>
      </div>
    </MarketingShell>
  )
}
