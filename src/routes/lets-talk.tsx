import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Link,
  createFileRoute,
  useRouteContext,
} from '@tanstack/react-router'
import { CheckCircle2, Mail, MessageSquare, Send } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
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
  { value: 'verification', label: 'Corporate Verification & Retrieval' },
  { value: 'database', label: 'Structured Company Database' },
  { value: 'due-diligence', label: 'Due Diligence Report' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
]

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.email('Please enter a valid work email.'),
  companyName: z.string().min(2, 'Company name is required'),
  jurisdiction: z.string().min(1, 'Please select a jurisdiction'),
  interest: z.string().min(1, "Please select what you're looking for"),
  message: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: 'Please accept to continue',
  }),
})

type ContactValues = z.infer<typeof contactSchema>

function LetsTalkPage() {
  const { user } = useRouteContext({ from: '__root__' })
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      jurisdiction: '',
      interest: '',
      message: '',
      consent: false,
    },
    mode: 'onTouched',
  })

  const onSubmit = (_data: ContactValues) => {
    // TODO(backend): wire to a real endpoint (SES + DynamoDB, or a
    // MENA-backend `leads` route) — see PRD §6.4/§9. Mocked for now.
    setSubmitted(true)
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-mist px-3 py-1 text-xs font-semibold text-brand-navy">
                <MessageSquare className="h-3 w-3 text-brand-cyan" />
                Contact Us
              </div>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
                Let's talk about your{' '}
                <span className="text-brand-cyan">MENA</span> intelligence
                needs.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Whether you need a single verification or an ongoing
                partnership, tell us what you're after and we'll route you to
                the right solution.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-brand-mist text-brand-navy">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand-navy">
                    Prefer email?
                  </div>
                  <div className="text-sm text-muted-foreground">
                    hello@ident-ity.com
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
                {submitted ? (
                  <div
                    className="flex flex-col items-center py-10 text-center"
                    data-testid="contact-success"
                  >
                    <CheckCircle2 className="size-12 text-brand-cyan" />
                    <h2 className="mt-4 text-xl font-bold text-brand-navy">
                      Thanks — we've got it.
                    </h2>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      Our team will get back to you shortly. In the meantime,
                      feel free to explore our solutions.
                    </p>
                    <Link to="/solutions" className="mt-6">
                      <Button variant="outline">View Solutions</Button>
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                              placeholder="Jane Doe"
                              aria-invalid={!!fieldState.error}
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
                            <FieldLabel htmlFor="contact-email" required>
                              Work email
                            </FieldLabel>
                            <Input
                              {...field}
                              id="contact-email"
                              type="email"
                              placeholder="jane@company.com"
                              aria-invalid={!!fieldState.error}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
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
                            placeholder="Acme Inc."
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
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                              <SelectContent>
                                {jurisdictions.map((j) => (
                                  <SelectItem key={j.code} value={j.name}>
                                    {j.flag} {j.name}
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
                        render={({ field, fieldState }) => (
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
                                <SelectValue placeholder="Select an option" />
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
                        )}
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
                            className="min-h-[110px] resize-none"
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
                            I agree to Ident-ity processing this information
                            to respond to my request.
                          </FieldLabel>
                        </Field>
                      )}
                    />
                    {form.formState.errors.consent && (
                      <FieldError
                        errors={[form.formState.errors.consent]}
                      />
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
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
