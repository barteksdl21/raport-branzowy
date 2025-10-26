"use client"

import type React from "react"
import { useState, HTMLAttributes } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useInView } from "react-intersection-observer"
import { CheckCircle2 } from "lucide-react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { event as gaEvent } from '../lib/gtag';

interface FormSectionProps {
  defaultReport?: string[];
}

const FormContent = ({ defaultReport = [] }: FormSectionProps) => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    report: defaultReport,
    privacyPolicy: false,
    dataProcessing: false,
    electronicServices: false
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentExpanded, setConsentExpanded] = useState(false);
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

  const handleReportChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      report: prev.report.includes(value)
        ? prev.report.filter((v) => v !== value)
        : [...prev.report, value],
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null); // Clear any previous errors at the start

      // --- 1. Perform all synchronous validation first ---
      if (formState.report.length === 0) {
        setSubmitError("Proszę wybrać przynajmniej jeden raport.");
        return; // Exit before entering the "submitting" state
      }

      if (!executeRecaptcha) {
        setSubmitError("ReCAPTCHA not loaded yet. Please try again in a moment.");
        return; // Exit before entering the "submitting" state
      }

      // --- 2. If validation passes, NOW set the submitting state ---
      setIsSubmitting(true);

      // --- 3. Proceed with asynchronous operations in a try/catch/finally block ---
      try {
        let recaptchaToken;
        try {
          recaptchaToken = await executeRecaptcha('submit_form_raport_branzowy');
        } catch (error) {
          console.error('Error executing reCAPTCHA:', error);
          // We throw an error here to be caught by the outer catch block
          throw new Error('Błąd podczas weryfikacji reCAPTCHA. Spróbuj ponownie.');
        }

        if (!recaptchaToken) {
          // Throwing an error is a good way to stop execution and go to the catch block
          throw new Error("Nie udało się uzyskać tokena reCAPTCHA. Spróbuj ponownie.");
        }

        const response = await fetch('/api/send-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formState,
            recaptchaToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send report');
        }

        setIsSubmitted(true);

        gaEvent({
          action: 'form_submit',
          category: 'RaportBranzowy',
          label: formState.report.join(', ') || 'not_selected',
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
        // This block will now reliably run after the async operations are done,
        // or if any error was thrown inside the `try` block.
        setIsSubmitting(false);
      }
    };

  const options = [
    { value: "dairy", label: "Raport branży mleczarskiej" },
    { value: "meat", label: "Raport branży mięsnej" },
    { value: "fruits", label: "Raport branży owocowo-warzywnej" },
  ];

  return (
    <>
    <div id="formularzSpacer" style={{ height: '100px', marginTop: '-100px', visibility: 'hidden' }} />
    <section ref={ref} id="formularz" className="w-full py-12 md:py-24 bg-muted scroll-mt-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className={`space-y-4`}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Pobierz bezpłatny raport branżowy</h2>
            <p className="text-muted-foreground md:text-xl">
              Wypełnij formularz i zdobądź przewagę konkurencyjną. Dowiedz się, jakie standardy bezpieczeństwa obowiązują w Twojej branży.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Dane z setek tysięcy testów laboratoryjnych</span>
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
                <span>Strategie zapewnienia jakości</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-eurofins-orange mr-2" />
                <span>Dostęp do ekspertów Eurofins</span>
              </div>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-lg shadow-lg`}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      onChange={handleChange}
                      placeholder="Imię"
                    />
                    <Input id="lastName" name="lastName" value={formState.lastName} onChange={handleChange} placeholder="Nazwisko" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="E-mail*"
                    />
                      <Input id="company" name="company" required value={formState.company} onChange={handleChange} placeholder="Nazwa firmy*" />
                  </div>



                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between truncate"
                        style={{border: "1px solid orange"}}
                      >
                        {formState.report.length > 0
                          ? (() => {
                              const selectedLabels = options
                                .filter((o) => formState.report.includes(o.value))
                                .map((o) => o.label);

                              const joined = selectedLabels.join(", ");

                              // If more than one selected, shorten and add count
                              if (selectedLabels.length > 1) {
                                return `${selectedLabels.length} raporty`;
                              }

                              // Only one selected — just show it
                              return joined;
                            })()
                          : "⮟ Wybierz raport"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-2"
                      align="start"
                    >
                      {options.map((item) => (
                        <div key={item.value} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={item.value}
                            checked={formState.report.includes(item.value)}
                            onCheckedChange={() => handleReportChange(item.value)}
                          />
                          <Label htmlFor={item.value}>{item.label}</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacyPolicy"
                      checked={formState.privacyPolicy}
                      onCheckedChange={(checked) => handleCheckboxChange("privacyPolicy", checked as boolean)}
                      required
                    />
                    <Label htmlFor="privacyPolicy" className="text-sm leading-normal">
                      Zapoznałem się i akceptuję politykę prywatności.*
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="dataProcessing"
                      checked={formState.dataProcessing}
                      onCheckedChange={(checked) => handleCheckboxChange("dataProcessing", checked as boolean)}
                      required
                    />
                    <Label htmlFor="dataProcessing" className="text-sm leading-normal w-full">
                      <div className="w-full">
                        <div className="relative">
                          {/* Main content container with gradient fade */}
                          <div className={`relative ${!consentExpanded ? "max-h-[3em] overflow-hidden" : ""}`} id="consent-details">
                            <div className="text-sm leading-normal">
                              Przeczytałem(-am) i zrozumiałem(-am){" "}
                              <a href="/polityka-prywatnosci" target="_blank" rel="noopener">
                                politykę prywatności
                              </a>
                              . Wyrażam zgodę na przetwarzanie{!consentExpanded && "..."} {consentExpanded && " moich danych osobowych przez podmioty należące do Sieci Laboratoriów Eurofins w celu przesyłania mi informacji i materiałów handlowych, ofert oraz materiałów marketingowych, w tym newsletterów handlowych i informacyjnych."}
                              
                              {consentExpanded && (
                                <div className="mt-2 text-muted-foreground">
                                  Zaznaczając pole 'pobierz', wyrażam zgodę na świadczenie usług drogą elektroniczną, co obejmuje również przesyłanie wiadomości, informacji oraz materiałów handlowych, marketingowych i promocyjnych za pośrednictwem środków komunikacji elektronicznej.*
                                </div>
                              )}
                            </div>

                            {/* Gradient fade hint when collapsed (non-interactive) */}
                            {!consentExpanded && (
                              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            )}
                          </div>
                          {/* Inline toggle link placed directly after the paragraph so it sits at the end of the text */}
                          <a
                            href="#"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setConsentExpanded((s: boolean) => !s); }}
                            className="text-eurofins-orange underline text-sm transition-all duration-150 hover:text-eurofins-orange/80 relative z-10"
                            aria-expanded={consentExpanded}
                            aria-controls="consent-details"
                          >
                            {consentExpanded ? "zwiń ▴" : "rozwiń ▾"}
                          </a>
                        </div>
                      </div>
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
                  {isSubmitting ? "Wysyłanie..." : "Pobierz bezpłatny raport"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  * Pola wymagane. Twoje dane są chronione zgodnie z naszą{" "}
                  <a href="/polityka-prywatnosci">
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
    </>
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
