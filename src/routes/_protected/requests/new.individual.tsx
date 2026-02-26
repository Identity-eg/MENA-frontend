import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  UserPlus,
  X,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { SubjectsTable } from '@/components/SubjectsTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_protected/requests/new/individual')({
  component: NewRequestIndividualsPage,
})

const STEPS = ['Add Individuals', 'Select Services', 'Review & Submit']

function generateId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function NewRequestIndividualsPage() {
  const [step, setStep] = useState(1)
  const [subjects, setSubjects] = useState<any[]>([
    {
      id: '1',
      type: 'Individual',
      fullName: 'John Smith',
      nationality: 'United States',
      idNumber: 'A12345678',
    },
  ])
  const [addIndividualModalOpen, setAddIndividualModalOpen] = useState(false)
  const [addIndividualForm, setAddIndividualForm] = useState({
    fullName: '',
    nationality: '',
    idNumber: '',
    email: '',
  })

  const handleAddIndividual = () => {
    if (!addIndividualForm.fullName.trim()) return
    setSubjects((prev) => [
      ...prev,
      {
        id: generateId(),
        type: 'Individual',
        fullName: addIndividualForm.fullName.trim(),
        nationality: addIndividualForm.nationality.trim() || undefined,
        idNumber: addIndividualForm.idNumber.trim() || undefined,
        email: addIndividualForm.email.trim() || undefined,
      },
    ])
    setAddIndividualForm({
      fullName: '',
      nationality: '',
      idNumber: '',
      email: '',
    })
    setAddIndividualModalOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          New individual request
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Step {step} of 3: {STEPS[step - 1]}
        </p>
        <div className="mt-4 flex gap-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                i + 1 <= step ? 'bg-primary' : 'bg-muted',
              )}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Bulk CSV upload
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download template
            </Button>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setAddIndividualModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Add individual
            </Button>
          </div>
          {addIndividualModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setAddIndividualModalOpen(false)}
            >
              <Card
                className="w-full max-w-md rounded-2xl border border-border shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                  <CardTitle className="text-lg">Add individual</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAddIndividualModalOpen(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-fullName">Full name</Label>
                    <Input
                      id="add-fullName"
                      placeholder="John Smith"
                      value={addIndividualForm.fullName}
                      onChange={(e) =>
                        setAddIndividualForm((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-nationality">Nationality</Label>
                    <Input
                      id="add-nationality"
                      placeholder="United States"
                      value={addIndividualForm.nationality}
                      onChange={(e) =>
                        setAddIndividualForm((prev) => ({
                          ...prev,
                          nationality: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-idNumber">ID number</Label>
                    <Input
                      id="add-idNumber"
                      placeholder="A12345678"
                      value={addIndividualForm.idNumber}
                      onChange={(e) =>
                        setAddIndividualForm((prev) => ({
                          ...prev,
                          idNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-email">Email (optional)</Label>
                    <Input
                      id="add-email"
                      type="email"
                      placeholder="john@example.com"
                      value={addIndividualForm.email}
                      onChange={(e) =>
                        setAddIndividualForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setAddIndividualModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddIndividual}
                      disabled={!addIndividualForm.fullName.trim()}
                    >
                      Add individual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <SubjectsTable
            subjects={subjects}
            readonly={false}
            onRemove={(id) =>
              setSubjects((prev) => prev.filter((s) => s.id !== id))
            }
          />
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the services you need. Estimated price and TAT are shown
              per service.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              
            </div>
          </div>
          <Card className="h-fit rounded-xl border border-border shadow-sm lg:sticky lg:top-24">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="text-base font-medium">
                Estimated summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subjects</span>
                  <span>{subjects.length}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Services</span>
                  <span></span>
                </div>
                <div className="flex justify-between font-medium text-foreground">
                  <span>Estimated total</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Est. TAT</span>
                  <span>0 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <Card className="rounded-xl border border-border shadow-sm">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="text-base">Subjects</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SubjectsTable subjects={subjects} readonly />
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border shadow-sm">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="text-base">
                Services & estimated total
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                
                <li className="flex justify-between border-t border-border pt-2 font-medium text-foreground">
                  <span>Total</span>
                  <span>$0</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                
                className="mt-1 rounded border-input"
              />
              <span className="text-sm text-muted-foreground">
                I confirm that I have a lawful basis to request this information
                and will use it in compliance with applicable data protection
                laws.
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 rounded border-input" />
              <span className="text-sm text-muted-foreground">
                I accept the terms of service and privacy policy.
              </span>
            </label>
          </div>
        </div>
      )}

      <div className="mt-10 flex justify-between border-t border-border pt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button>Submit request</Button>
        )}
      </div>
    </DashboardLayout>
  )
}
