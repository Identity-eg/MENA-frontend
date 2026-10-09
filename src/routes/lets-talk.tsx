import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useRouteContext } from '@tanstack/react-router'
import { CheckCircle2, Mail, MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Flag } from '@/components/marketing/flag'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import type { TFrontendErrorResponse } from '@/apis/base/error-type'
import { useSendContactMessage } from '@/apis/contact/send-contact-message'
import { businessEmailSchema } from '@/lib/business-email'
import { jurisdictions } from '@/lib/jurisdictions'

export const Route = createFileRoute('/lets-talk')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Contact Us | Ident-ity' },
      {
        name: 'description',
        content:
          "Tell us what you're looking for and we'll route you to the right Ident-ity solution.",
      },
    ],
  }),
  component: LetsTalkPage,
})

const interestOptions = [
  { value: 'verification', label: 'Corporate Retrieval' },
  { value: 'database', label: 'Structured Database' },
  { value: 'due-diligence', label: 'Due Diligence Report' },
  { value: 'partnership', label: 'Human Source Enquiries' },
  { value: 'other', label: 'Other' },
]

const contactSchema = z.object({
  fullName: z
    .string('Full name is required')
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: businessEmailSchema,
  companyName: z
    .string('Company name is required')
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  jurisdiction: z
    .string('Please select a jurisdiction')
    .min(1, 'Please select a jurisdiction'),
  interest: z
    .string("Please select what you're looking for")
    .min(1, "Please select what you're looking for"),
  message: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: 'Please accept to continue',
  }),
})

type ContactValues = z.infer<typeof contactSchema>

function LetsTalkPage() {
  const { user } = useRouteContext({ from: '__root__' })
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const sendContactMessage = useSendContactMessage()

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      companyName: '',
      jurisdiction: '',
      interest: '',
      message: '',
      consent: false,
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: ContactValues) => {
    setSubmitError(null)
    try {
      await sendContactMessage.mutateAsync(data)
      setSubmitted(true)
    } catch (error) {
      const { message } = error as TFrontendErrorResponse
      setSubmitError(message || 'Something went wrong. Please try again.')
    }
  }

  const isSubmitting =
    form.formState.isSubmitting || sendContactMessage.isPending

  return (
    <MarketingShell user={user}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-brand-mist px-3.5 py-1.5 text-xs font-medium text-foreground">
              <MessageSquare className="h-3 w-3 text-brand-cyan-ink" />
              Contact Us
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[0.98] tracking-display text-brand-navy sm:text-5xl">
              Let's talk about your{' '}
              <span className="text-brand-cyan-ink">MENA</span> intelligence
              needs.
            </h1>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
              Whether you need a single verification or an ongoing partnership,
              tell us what you're after and we'll route you to the right
              solution.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-brand-mist text-brand-cyan-ink">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-brand-navy">
                  Prefer email?
                </div>
                <div className="text-sm text-muted-foreground">
                  operations@ident-ity.com
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-brand-mist/60 p-6 text-brand-ink sm:p-8">
              {submitted ? (
                <div
                  className="flex flex-col items-center py-10 text-center"
                  data-testid="contact-success"
                >
                  <CheckCircle2 className="size-12 text-brand-cyan-ink" />
                  <h2 className="mt-4 text-xl font-semibold text-brand-navy">
                    Thanks, we have got it.
                  </h2>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Our team will get back to you shortly. In the meantime, feel
                    free to explore our solutions.
                  </p>
                  <Link to="/solutions" className="mt-6">
                    <Button variant="outline">See solutions</Button>
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  <div
                    className={`grid grid-cols-1 gap-5 ${!user ? 'sm:grid-cols-2' : ''}`}
                  >
                    <Controller
                      name="fullName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel htmlFor="contact-fullName" required>
                            Full name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="contact-fullName"
                            placeholder="Layla Haddad"
                            aria-invalid={!!fieldState.error}
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    {!user && (
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor="contact-email" required>
                              Business email
                            </FieldLabel>
                            <Input
                              {...field}
                              id="contact-email"
                              type="email"
                              placeholder="layla@company.com"
                              aria-invalid={!!fieldState.error}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    )}
                  </div>

                  <Controller
                    name="companyName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="contact-company" required>
                          Company name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="contact-company"
                          placeholder="Company name"
                          aria-invalid={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Controller
                      name="jurisdiction"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel required>
                            Jurisdiction of interest
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className="w-full"
                              aria-invalid={!!fieldState.error}
                            >
                              <SelectValue
                                placeholder="Select a country"
                                className="text-natural-400/50"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {jurisdictions.map((j) => (
                                <SelectItem key={j.code} value={j.name}>
                                  <span className="inline-flex items-center gap-1.5">
                                    <Flag code={j.code} />
                                    {j.name}
                                  </span>
                                </SelectItem>
                              ))}
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="interest"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        const selectedLabel = interestOptions.find(
                          (opt) => opt.value === field.value,
                        )?.label
                        return (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel required>Looking for</FieldLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className="w-full"
                                aria-invalid={!!fieldState.error}
                              >
                                <SelectValue
                                  placeholder="Select an option"
                                  className="text-natural-400/50"
                                >
                                  {selectedLabel}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {interestOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )
                      }}
                    />
                  </div>

                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="contact-message">
                          Message
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="contact-message"
                          placeholder="Tell us more about your request..."
                          className="min-h-27.5 resize-none"
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name="consent"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="horizontal"
                        data-invalid={!!fieldState.error}
                      >
                        <Checkbox
                          id="contact-consent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-invalid={!!fieldState.error}
                        />
                        <FieldLabel
                          htmlFor="contact-consent"
                          className="text-xs font-normal text-muted-foreground"
                        >
                          I agree to Ident-ity processing this information to
                          respond to my request.
                        </FieldLabel>
                      </Field>
                    )}
                  />
                  {form.formState.errors.consent && (
                    <FieldError errors={[form.formState.errors.consent]} />
                  )}

                  {submitError && (
                    <p
                      role="alert"
                      className="text-sm text-destructive"
                      data-testid="contact-error"
                    >
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  )
}
