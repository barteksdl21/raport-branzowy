'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface SubscriptionChoices {
  newsletter: boolean; // true means user wants to unsubscribe from newsletter
  marketing: boolean;  // true means user wants to unsubscribe from marketing
}

function UnsubscribeFormContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [subscriptionChoices, setSubscriptionChoices] = useState<SubscriptionChoices>({ 
    newsletter: false, 
    marketing: false 
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessfullyProcessed, setIsSuccessfullyProcessed] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get('token');
    const typeFromQuery = searchParams.get('type'); // 'marketing', 'newsletter', or 'all'

    if (tokenFromQuery) {
      setToken(tokenFromQuery);
      let initialChoices: SubscriptionChoices = { newsletter: false, marketing: false };
      if (typeFromQuery === 'marketing') {
        initialChoices = { newsletter: false, marketing: true };
      } else if (typeFromQuery === 'newsletter') {
        initialChoices = { newsletter: true, marketing: false };
      } else if (typeFromQuery === 'all') {
        initialChoices = { newsletter: true, marketing: true };
      } else {
        // Default if no type or unknown type, assume they might want to unsubscribe from what they clicked, or both
        // For safety and clarity, let's default to allowing them to choose, pre-selecting nothing or both.
        // Pre-selecting both for unsubscription if type is unclear might be a common expectation.
        initialChoices = { newsletter: true, marketing: true }; 
      }
      setSubscriptionChoices(initialChoices);
    } else {
      setMessage('Nieprawidłowy lub brakujący token. Proszę użyć linku z wiadomości e-mail.');
      setIsError(true);
      setIsSuccessfullyProcessed(true); // To hide form
    }
  }, [searchParams]);

  const handleCheckboxChange = (type: keyof SubscriptionChoices) => {
    setSubscriptionChoices(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleUnsubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setMessage('Brak tokenu. Nie można przetworzyć żądania.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    let subscriptionTypeApi: string;
    if (subscriptionChoices.newsletter && subscriptionChoices.marketing) {
      subscriptionTypeApi = 'all';
    } else if (subscriptionChoices.newsletter) {
      subscriptionTypeApi = 'newsletter';
    } else if (subscriptionChoices.marketing) {
      subscriptionTypeApi = 'marketing';
    } else {
      setMessage('Nie wybrano żadnej opcji do rezygnacji. Twoje subskrypcje pozostają aktywne.');
      setIsError(false); // Not an error, but an informational message
      setIsLoading(false);
      setIsSuccessfullyProcessed(true); // Show message and hide form
      return;
    }

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, subscriptionType: subscriptionTypeApi }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Pomyślnie zaktualizowano Twoje preferencje subskrypcji.');
        setIsError(false);
        setIsSuccessfullyProcessed(true);
      } else {
        setMessage(data.error || 'Wystąpił błąd podczas aktualizacji subskrypcji.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setMessage('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      setIsError(true);
    }
    setIsLoading(false);
  };
  
  const noOptionsSelected = !subscriptionChoices.newsletter && !subscriptionChoices.marketing;

  return (
    <div className="container mx-auto px-4 py-16 md:py-20 flex flex-col items-center justify-center flex-1 min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-xl border dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-primary">
            Zarządzaj Subskrypcjami
          </h2>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border flex items-start space-x-3 text-sm ${isError
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500/50 text-red-700 dark:text-red-400'
                : 'bg-green-50 dark:bg-green-900/20 border-green-500/50 text-green-700 dark:text-green-400'}`}>
              {isError ? <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />}
              <p>{message}</p>
            </div>
          )}

          {!isSuccessfullyProcessed && token && (
            <form className="space-y-6" onSubmit={handleUnsubscribe}>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Zaznacz poniżej, z których typów komunikacji chcesz zrezygnować.
                </p>
                <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id="unsubscribeNewsletter"
                    checked={subscriptionChoices.newsletter} 
                    onCheckedChange={() => handleCheckboxChange('newsletter')}
                    disabled={isLoading}
                    aria-label="Zrezygnuj z newslettera"
                  />
                  <Label htmlFor="unsubscribeNewsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer">
                    Zrezygnuj z subskrypcji newslettera
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id="unsubscribeMarketing" 
                    checked={subscriptionChoices.marketing} 
                    onCheckedChange={() => handleCheckboxChange('marketing')}
                    disabled={isLoading}
                    aria-label="Zrezygnuj z komunikacji marketingowej"
                  />
                  <Label htmlFor="unsubscribeMarketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer">
                    Zrezygnuj z komunikacji marketingowej (np. o nowych raportach)
                  </Label>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-eurofins-orange hover:bg-eurofins-orange/90 text-white dark:text-gray-900 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Przetwarzanie...
                    </>
                  ) : (
                     noOptionsSelected ? 'Potwierdź (pozostaję zapisany/a)' : 'Zatwierdź zmiany'
                  )}
                </Button>
              </div>
            </form>
          )}

          {isSuccessfullyProcessed && (
             <div className="mt-8 text-center">
                <Button variant="outline" asChild>
                  <Link href="/">
                    Wróć na stronę główną
                  </Link>
                </Button>
             </div>
          )}
        </div>

        {!isSuccessfullyProcessed && token && (
            <div className="mt-8 text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Anuluj i wróć na stronę główną
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}> 
      <UnsubscribeFormContent />
    </Suspense>
  );
}