import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/lets-talk')({
  pendingComponent: FullPageLoading,
  component: LetsTalkPage,
})

function LetsTalkPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Left side: Content */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-primary mb-6 w-fit">
                <MessageSquare className="h-3 w-3" />
                <span>Contact Us</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                Let's start a <span className="text-primary">conversation</span>
                .
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Whether you have a question about our platform, need a custom
                solution, or just want to say hello, we're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-card text-primary shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Email us</div>
                    <div className="text-sm text-muted-foreground">
                      support@complianceportal.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-card text-primary shadow-sm">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Call us</div>
                    <div className="text-sm text-muted-foreground">
                      +1 (555) 000-0000
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-card text-primary shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Visit us</div>
                    <div className="text-sm text-muted-foreground">
                      123 Compliance St, Risk City, RC 12345
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 blur-2xl" />
              <div className="relative rounded-3xl border bg-card p-8 shadow-xl lg:p-12">
                <form
                  className="space-y-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First name</label>
                      <Input placeholder="John" className="bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last name</label>
                      <Input placeholder="Doe" className="bg-muted/30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email address</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="bg-muted/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="How can we help?"
                      className="bg-muted/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px] bg-muted/30 resize-none"
                    />
                  </div>

                  <Button className="w-full h-12 text-base font-semibold gap-2 shadow-lg shadow-primary/20">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
