"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useInView } from "react-intersection-observer"
import { CheckCircle2 } from "lucide-react"

interface FormSectionProps {
  defaultReport?: string;
}

export function FormSection({ defaultReport = "" }: FormSectionProps) {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    report: defaultReport,
    consent: false,
    marketing: false,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, report: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          company: formState.company,
          report: formState.report,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send report');
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={ref} id="formularz" className="w-full py-12 md:py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className={`space-y-4 ${inView ? "animate-slide-in-left" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Pobierz raport branżowy</h2>
            <p className="text-muted-foreground md:text-xl">
              Wypełnij formularz, aby otrzymać wybrany raport branżowy na swój adres e-mail. Nasze raporty zawierają
              cenne informacje, które pomogą Ci podejmować lepsze decyzje biznesowe.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Szczegółowe analizy laboratoryjne</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Trendy rynkowe i konsumenckie</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Porównanie z normami europejskimi</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Rekomendacje dla producentów</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Dostęp do ekspertów Eurofins</span>
              </div>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-lg shadow-lg ${inView ? "animate-slide-in-right" : "opacity-0"}`}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Imię *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formState.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko *</Label>
                    <Input id="lastName" name="lastName" required value={formState.lastName} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Nazwa firmy *</Label>
                  <Input id="company" name="company" required value={formState.company} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report">Wybierz raport *</Label>
                  <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz raport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meat">Raport branży mięsnej</SelectItem>
                      <SelectItem value="dairy">Raport branży mleczarskiej</SelectItem>
                      <SelectItem value="fruits">Raport branży owocowo-warzywnej</SelectItem>
                      <SelectItem value="seafood">Raport branży rybnej</SelectItem>
                      <SelectItem value="grain">Raport branży zbożowej</SelectItem>
                      <SelectItem value="beverages">Raport branży napojów</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent"
                      checked={formState.consent}
                      onCheckedChange={(checked) => handleCheckboxChange("consent", checked as boolean)}
                      required
                    />
                    <Label htmlFor="consent" className="text-sm">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu otrzymania raportu *
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formState.marketing}
                      onCheckedChange={(checked) => handleCheckboxChange("marketing", checked as boolean)}
                    />
                    <Label htmlFor="marketing" className="text-sm">
                      Wyrażam zgodę na otrzymywanie informacji marketingowych od Eurofins Polska
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-eurofins-orange hover:bg-eurofins-orange/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wysyłanie..." : "Pobierz raport"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  * Pola wymagane. Twoje dane są chronione zgodnie z naszą{" "}
                  <a href="#" className="underline">
                    polityką prywatności
                  </a>
                  .
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Dziękujemy!</h3>
                <p className="text-muted-foreground">
                  Twój raport został wysłany na podany adres email. Sprawdź swoją skrzynkę odbiorczą.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4">
                  Pobierz inny raport
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
