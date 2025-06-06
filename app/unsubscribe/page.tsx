'use client';

import type { Metadata } from 'next';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return {
  title: 'Wypisz się z Newslettera | Eurofins Polska',
  description: 'Zarządzaj swoimi subskrypcjami newslettera Eurofins Polska.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Wypisz się z Newslettera | Eurofins Polska',
    description: 'Zarządzaj swoimi subskrypcjami newslettera Eurofins Polska.',
    url: 'https://raportbranzowy.pl/unsubscribe',
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wypisz się z Newslettera | Eurofins Polska',
    description: 'Zarządzaj swoimi subskrypcjami newslettera Eurofins Polska.',
  },
  alternates: {
    canonical: 'https://raportbranzowy.pl/unsubscribe',
  }
  };
}

function UnsubscribeFormContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
      // Uncomment below to automatically submit if email is in query params
      // handleSubmitInternal(emailFromQuery);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps
  // Added eslint-disable for handleSubmitInternal if it were used in auto-submit

  const handleSubmitInternal = async (currentEmail: string) => {
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    if (!currentEmail.trim() || !/\S+@\S+\.\S+/.test(currentEmail)) {
      setMessage('Proszę podać prawidłowy adres email.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: currentEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Pomyślnie wypisano z newslettera.');
        setIsError(false);
        setEmail('');
      } else {
        setMessage(data.error || 'Wystąpił błąd podczas wypisywania. Sprawdź email i spróbuj ponownie.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setMessage('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitInternal(email);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-20 flex flex-col items-center justify-center flex-1">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-xl border dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-primary">
            Wypisz się z newslettera
          </h2>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border flex items-start space-x-3 text-sm ${isError
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500/50 text-red-700 dark:text-red-400'
                : 'bg-green-50 dark:bg-green-900/20 border-green-500/50 text-green-700 dark:text-green-400'}`}>
              {isError ? <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />}
              <p>{message}</p>
            </div>
          )}

          {(!message || isError) && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Adres email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ty@example.com"
                  disabled={isLoading}
                  className="mt-1.5"
                />
              </div>

              <div>
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
                    'Wypisz mnie'
                  )}
                </Button>
              </div>
            </form>
          )}

          {message && !isError && (
             <div className="mt-8 text-center">
                <Button variant="outline" asChild>
                  <Link href="/">
                    Wróć na stronę główną
                  </Link>
                </Button>
             </div>
          )}
        </div>

        {(!message || isError) && (
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