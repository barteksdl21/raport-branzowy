import { HeroSection } from "@/components/hero-section"
import { ReportsSection } from "@/components/reports-section"
import { AboutSection } from "@/components/about-section"
import { FormSection } from "@/components/form-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FaqSection } from "@/components/faq-section"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Raporty Branżowe | Eurofins Polska",
  description: "Pobierz najnowsze raporty branżowe od Eurofins Polska. Kompleksowe analizy dla sektorów przemysłu spożywczego, w tym badania żywności, środowiska i produktów konsumenckich.",
  keywords: ["raporty branżowe", "Eurofins Polska", "analizy", "badania", "żywność", "środowisko", "badania laboratoryjne", "raporty branżowe", "badania żywności"],
  openGraph: {
    title: "Raporty Branżowe | Eurofins Polska",
    description: "Pobierz najnowsze raporty branżowe od Eurofins Polska. Kompleksowe analizy dla sektorów przemysłu spożywczego.",
    url: "https://raportbranzowy.pl", 
    siteName: "Eurofins Polska Raporty Branżowe",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raporty Branżowe | Eurofins Polska",
    description: "Pobierz najnowsze raporty branżowe od Eurofins Polska. Kompleksowe analizy dla sektorów przemysłu spożywczego.",
  },
  alternates: {
    canonical: 'https://raportbranzowy.pl',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <ReportsSection />
      <BenefitsSection />
      <AboutSection />
      <FormSection />
      <FaqSection />
    </div>
  )
}
