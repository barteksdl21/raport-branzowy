"use client"

import { useInView } from "react-intersection-observer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Jak mogę uzyskać dostęp do raportów branżowych?",
    answer:
      "Aby uzyskać dostęp do raportów branżowych Eurofins Polska, wystarczy wypełnić formularz na naszej stronie, podając swoje dane kontaktowe. Po weryfikacji, raport zostanie wysłany na podany adres e-mail.",
  },
  {
    question: "Czy raporty są dostępne bezpłatnie?",
    answer:
      "Tak, nasze raporty branżowe są dostępne bezpłatnie dla firm z sektora spożywczego. Wymagane jest jedynie wypełnienie formularza z danymi kontaktowymi.",
  },
  {
    question: "Jak często publikowane są nowe raporty?",
    answer:
      "Nowe raporty branżowe publikujemy raz w roku dla każdego sektora. Dodatkowo, w ciągu roku mogą pojawiać się aktualizacje lub raporty specjalne dotyczące konkretnych zagadnień.",
  },
  {
    question: "Jakie informacje zawierają raporty branżowe?",
    answer:
      "Nasze raporty zawierają kompleksowe analizy laboratoryjne produktów z danej branży, trendy rynkowe, porównania z normami europejskimi, informacje o zagrożeniach i zanieczyszczeniach oraz rekomendacje dla producentów.",
  },
  {
    question: "Czy mogę zamówić raport spersonalizowany dla mojej firmy?",
    answer:
      "Tak, oferujemy również możliwość przygotowania spersonalizowanych raportów, uwzględniających specyfikę Państwa produktów i procesów. W tej sprawie prosimy o bezpośredni kontakt z naszym działem obsługi klienta.",
  },
  {
    question: "W jakim formacie otrzymam raport?",
    answer:
      "Raporty dostarczamy w formacie PDF, który można łatwo przeglądać na komputerze, tablecie lub smartfonie. Na życzenie możemy również przygotować wersję drukowaną.",
  },
]

export function FaqSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} id="faq" className="w-full py-12 md:py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <div
          className={`flex flex-col items-center justify-center space-y-4 text-center mb-10 ${
            inView ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Najczęściej zadawane pytania
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszych raportów branżowych.
            </p>
          </div>
        </div>

        <div
          className={`max-w-3xl mx-auto ${inView ? "animate-slide-up" : "opacity-0"}`}
          style={{ animationDelay: "0.2s" }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-primary font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div
          className={`mt-10 text-center ${inView ? "animate-fade-in" : "opacity-0"}`}
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-muted-foreground">Nie znalazłeś odpowiedzi na swoje pytanie? Skontaktuj się z nami:</p>
          <p className="font-medium text-primary mt-2">info@eurofins.pl | +48 22 123 45 67</p>
        </div>
      </div>
    </section>
  )
}
