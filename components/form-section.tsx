"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useInView } from "react-intersection-observer"
import { CheckCircle2 } from "lucide-react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { event as gaEvent } from '../lib/gtag';

interface FormSectionProps {
  defaultReport?: string;
}

const FormContent = ({ defaultReport = "" }: FormSectionProps) => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    report: defaultReport,
    privacyPolicy: false,
    dataProcessing: false,
    electronicServices: false
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitError, setSubmitError] = useState<string | null>(null)

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

  // Helper for "Zaznacz wszystkie"
  const allChecked = formState.privacyPolicy && formState.dataProcessing && formState.electronicServices;
  const someChecked = formState.privacyPolicy || formState.dataProcessing || formState.electronicServices;
  const handleCheckAll = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      privacyPolicy: checked,
      dataProcessing: checked,
      electronicServices: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!executeRecaptcha) {
      setSubmitError("ReCAPTCHA not loaded yet. Please try again in a moment.");
      setIsSubmitting(false);
      return;
    }

    let recaptchaToken;
    try {
      recaptchaToken = await executeRecaptcha('submit_form_raport_branzowy');
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      setSubmitError('Błąd podczas weryfikacji reCAPTCHA. Spróbuj ponownie.');
      setIsSubmitting(false);
      return;
    }

    if (!recaptchaToken) {
      setSubmitError("Nie udało się uzyskać tokena reCAPTCHA. Spróbuj ponownie.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          recaptchaToken, // Send v3 token to backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send report');
      }

      setIsSubmitted(true);

      // Track form submission in Google Analytics
      gaEvent({
        action: 'form_submit',
        category: 'RaportBranzowy',
        label: formState.report || 'not_selected',
        value: 1,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        setSubmitError(error.message || 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.');
      } else {
        setSubmitError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="formularz" className="w-full py-12 md:py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className={`space-y-4 ${inView ? "animate-slide-in-left" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Pobierz raport branżowy</h2>
            <p className="text-muted-foreground md:text-xl">
            Wypełnij formularz i otrzymaj wybrany raport bezpośrednio na swój e-mail. Znajdziesz w nim kluczowe informacje o branży, które pomogą Ci podejmować decyzje biznesowe dotyczące bezpieczeństwa i jakości Twoich produktów.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Szczegółowe analizy danych</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Trendy rynkowe</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Wnioski wynikające ze zmian w przepisach</span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Nazwa firmy *</Label>
                    <Input id="company" name="company" required value={formState.company} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Stanowisko *</Label>
                    <Input id="position" name="position" required value={formState.position} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report">Wybierz raport *</Label>
                  <Select value={formState.report} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz raport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dairy">Raport branży mleczarskiej</SelectItem>
                      <SelectItem value="meat">Raport branży mięsnej</SelectItem>
                      <SelectItem value="fruits">Raport branży owocowo-warzywnej</SelectItem>
                      {/* <SelectItem value="seafood">Raport branży rybnej</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacyPolicy"
                      checked={formState.privacyPolicy}
                      onCheckedChange={(checked) => handleCheckboxChange("privacyPolicy", checked as boolean)}
                      required
                    />
                    <Label htmlFor="privacyPolicy" className="text-sm leading-normal">
                      Zapoznałem się i akceptuję politykę prywatności. *
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="dataProcessing"
                      checked={formState.dataProcessing}
                      onCheckedChange={(checked) => handleCheckboxChange("dataProcessing", checked as boolean)}
                      required
                    />
                    <Label htmlFor="dataProcessing" className="text-sm leading-normal">
                    Przeczytałem(-am) i zrozumiałem(-am) <a href="/polityka-prywatnosci" className="underline">politykę prywatności</a>. Wyrażam zgodę na przetwarzanie moich danych osobowych przez podmioty należące do Sieci Laboratoriów Eurofins w celu przesyłania mi informacji i materiałów handlowych, ofert oraz materiałów marketingowych, w tym newsletterów handlowych i informacyjnych.
 <br />
Zaznaczając pole 'pobierz', wyrażam zgodę na świadczenie usług drogą elektroniczną, co obejmuje również przesyłanie wiadomości, informacji oraz materiałów handlowych, marketingowych i promocyjnych za pośrednictwem środków komunikacji elektronicznej.*
  
                    </Label>
                  </div>
                </div>

                {submitError && (
                  <div className="my-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>{submitError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-eurofins-orange hover:bg-eurofins-orange/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wysyłanie..." : "Pobierz raport"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  * Pola wymagane. Twoje dane są chronione zgodnie z naszą{" "}
                  <a href="/polityka-prywatnosci" className="underline">
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
                  Twój raport został wysłany na podany adres email. Sprawdź swoją skrzynkę odbiorczą. Wiadomość może znajdować się w folderze SPAM.
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

export function FormSection({ defaultReport = "" }: FormSectionProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error("ReCAPTCHA Site Key is not defined. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable.");
    // Optionally render a message to the user or a disabled form
    return (
      <section id="formularz" className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-red-500">Konfiguracja formularza jest niekompletna. Skontaktuj się z administratorem.</p>
        </div>
      </section>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <FormContent defaultReport={defaultReport} />
    </GoogleReCaptchaProvider>
  );
}
