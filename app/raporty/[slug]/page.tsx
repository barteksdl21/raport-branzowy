import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FormSection } from "@/components/form-section"
import type { Metadata } from 'next';

// This would typically come from a database or API

export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await paramsPromise;
  const slug = params.slug;
  const report = reports.find((r) => r.slug === slug);

  if (!report) {
    // Optionally, return default metadata or handle as needed
    // For now, relying on the page's notFound() for the page itself
    return {
      title: "Raport nie znaleziony",
      description: "Szukany raport nie został odnaleziony.",
    };
  }

  return {
    title: report.title + " | Eurofins Polska",
    description: report.description,
    alternates: {
      canonical: `https://raportbranzowy.pl/raporty/${report.slug}`,
    },
  };
}

const reports = [
  {
    id: 1,
    title: "Raport branży mięsnej",
    slug: "raport-branzy-miesnej",
    formValue: "meat",
    description:
      "Aktualne trendy rynkowe, najnowsze technologie i metody badawcze w sektorze mięsnym",
    longDescription:
      "Raport Eurofins Polska dla branży mięsnej to dostarcza aktualnych informacji na temat dostępnych rozwiązań w zakresie kontroli jakości i bezpieczeństwa produktów mięsnych dostępnych na polskim rynku. Zawiera analizę wyników badań laboratoryjnych, w tym obecności drobnoustrojów, metali ciężkich oraz antybiotyków. Raport zawiera również komentarze do najważniejszych przepisów oraz regulacji prawnych obowiązujących producentów i dystrybutorów mięsa.",
    methodology:
      "Raport powstał w oparciu o badania przeprowadzone w laboratoriach Eurofins Polska w latach 2021-2024. Analizy obejmują szeroki zakres testów mikrobiologicznych, fizykochemicznych oraz sensorycznych, przeprowadzonych na próbkach produktów dostępnych na polskim rynku mięsnym.",
    whyItMatters:
      "Zestawienie stanowi cenne narzędzie dla producentów oraz dystrybutorów z branży mięsnej. Dostarcza szczegółowych danych, które pomagają lepiej zrozumieć aktualne trendy i wyzwania, opracować sposoby zarządzania zagrożeniami mikrobiologicznymi w środowisku produkcji oraz optymalizować ofertę produktową, tak by spełniała oczekiwania konsumentów i wymogi prawne.",
    image: "/LP_1370x325_mięso.jpg",
    comingSoon: false,
    keyFindings: [
      "Badania mikrobiologiczne i fizykochemiczne",
      "Ocena zgodności z normami UE",
      "Analiza pozostałości antybiotyków",
      "Rekomendacje dla producentów"
    ]
  },
  {
    id: 2,
    title: "Raport branży mleczarskiej",
    slug: "raport-branzy-mleczarskiej",
    formValue: "dairy",
    description:
      "Szczegółowe badania produktów mlecznych. Analiza jakości, bezpieczeństwa i innowacji w sektorze mleczarskim.",
    longDescription:
      "Nasz raport dla branży mleczarskiej dostarcza aktualnych informacji na temat rozwiązań w zakresie kontroli jakości i bezpieczeństwa produktów mlecznych dostępnych na polskim rynku. Zawiera analizę wyników badań laboratoryjnych, w tym obecności drobnoustrojów, metali ciężkich oraz dodatków do żywności. Raport zawiera również komentarze do obowiązujących przepisów i regulacji prawnych.",
    methodology:
      "Raport powstał w oparciu o badania przeprowadzone w laboratoriach Eurofins Polska w latach 2023-2024. Analizy obejmują szeroki zakres testów mikrobiologicznych, fizykochemicznych oraz sensorycznych, przeprowadzonych na próbkach produktów dostępnych na polskim rynku mleczarskim.",
    whyItMatters:
      "Zestawienie stanowi cenne narzędzie dla producentów oraz dystrybutorów z branży mleczarskiej. Dostarcza szczegółowych danych, które pomagają lepiej zrozumieć aktualne trendy i wyzwania, opracować sposoby zarządzania zagrożeniami mikrobiologicznymi w środowisku produkcji oraz optymalizować ofertę produktową, tak by spełniała oczekiwania konsumentów i wymogi prawne.",
    image: "/mleko-header-2.jpeg",
    comingSoon: false,
    keyFindings: [
      "Badania mikrobiologiczne i fizykochemiczne",
      "Ocena zgodności z normami UE",
      "Zafałszowania produktów mlecznych",
      "Rekomendacje dla producentów"
    ]
  },
  {
    id: 3,
    title: "Raport branży owocowo-warzywnej",
    slug: "raport-branzy-owocowo-warzywnej",
    formValue: "fruits",
    description:
      "Aktualne trendy rynkowe, najnowsze technologie i zmiany prawne w sektorze owocowo-warzywnym",
    longDescription:
      "Raport Eurofins Polska dla branży owocowo-warzywnej dostarcza aktualnych informacji na temat dostępnych rozwiązań w zakresie kontroli jakości i bezpieczeństwa świeżych oraz przetworzonych produktów owocowych i warzywnych na polskim rynku. Zawiera analizę wyników badań laboratoryjnych, obejmujących m.in. obecność pozostałości pestycydów, metali ciężkich oraz patogenów. W raporcie znajdują się również komentarze do obowiązujących przepisów i norm dotyczących branży owocowo-warzywnej.",
    methodology:
      "Raport powstał w oparciu o badania przeprowadzone w laboratoriach Eurofins Polska w latach 2022-2024. Analizy obejmują szeroki zakres testów mikrobiologicznych, fizykochemicznych oraz w zakresie monitoringu środowiska produkcji, przeprowadzonych na próbkach świeżych i przetworzonych owoców i warzyw dostępnych na polskim rynku.",
    whyItMatters:
      "Zestawienie stanowi cenne narzędzie dla producentów oraz dystrybutorów z branży owocowo-warzywnej. Dostarcza szczegółowych danych, które pomagają lepiej zrozumieć aktualne trendy i wyzwania, identyfikować i zarządzać zagrożeniami związanymi z bezpieczeństwem produktów oraz pozostawać na bieżące ze zmianami prawnymi.",
    image: "/LP_1370x325_owoce_i_warzywa.jpg",
    comingSoon: false,
    keyFindings: [
      "Badania mikrobiologiczne i fizykochemiczne",
      "Ocena zgodności z normami UE",
      "Badania przechowalnicze – kontrola jakości i trwałości produktów",
      "Rekomendacje dla producentów"
    ]
  },
  {
    id: 4,
    title: "Raport branży rybnej",
    slug: "raport-branzy-rybnej",
    formValue: "seafood",
    description:
      "Szczegółowe badania produktów mlecznych. Analiza jakości, bezpieczeństwa i innowacji w sektorze mleczarskim.",
    longDescription:
      "Nasz raport branży mleczarskiej dostarcza szczegółowych informacji na temat jakości i bezpieczeństwa produktów mlecznych dostępnych na polskim rynku. Zawiera analizę wyników badań laboratoryjnych, w tym obecności drobnoustrojów, metali ciężkich oraz dodatków do żywności. Raport zawiera również porównanie z normami unijnymi i rekomendacje dla producentów.",
    methodology:
      "Raport powstał w oparciu o badania przeprowadzone w laboratoriach Eurofins Polska, realizowane zgodnie z najwyższymi standardami jakości i rzetelności. Analizy obejmują szeroki zakres testów mikrobiologicznych, fizykochemicznych oraz sensorycznych, przeprowadzonych na próbkach produktów dostępnych na polskim rynku mleczarskim.",
    whyItMatters:
      "Raport stanowi cenne narzędzie dla producentów oraz dystrybutorów z branży mleczarskiej. Dostarcza szczegółowych danych, które pomagają lepiej zrozumieć aktualne trendy i wyzwania, opracować sposoby zarządzania zagrożeniami mikrobiologicznymi w środowisku produkcji oraz optymalizować ofertę produktową, tak by spełniała oczekiwania konsumentów i wymogi prawne.",
    image: "/LP_1370x325_ryby.jpg",
    comingSoon: false,
    keyFindings: [
      "Badania mikrobiologiczne i fizykochemiczne",
      "Ocena zgodności z normami UE",
      "Zafałszowania produktów mlecznych",
      "Rekomendacje dla producentów"
    ]
  }
]

export default async function ReportDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  // Ensure params are awaited before use
  const params = await paramsPromise;
  const slug = params.slug;
  
  const report = reports.find((r) => r.slug === slug)

  if (!report) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>
      {/* Main content area for report details */}
      <section className="pt-2 pb-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Report header with image */}
          <div className="relative h-80 w-full rounded-xl overflow-hidden mb-12">
            <Image 
              src={report.image} 
              alt={report.title}
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold tracking-tight">{report.title}</h1>
                <p className="text-lg mt-2 max-w-3xl">{report.description}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-eurofins-orange hover:bg-eurofins-orange/90 text-white">
              <Link href="/#formularz">
                <strong>Pobierz raport</strong>
                <ArrowRight className="ml-2 h-4 w-4" style={{ animation: "nudge 1s ease-in-out infinite" }} />
              </Link>
            </Button>
          </div>
          {/* Report content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main description */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-10 h-1 bg-eurofins-orange mr-3"></span>
                  Opis raportu
                </h2>
                <p className="text-lg text-gray-600">{report.longDescription}</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-10 h-1 bg-eurofins-orange mr-3"></span>
                  Metodologia
                </h2>
                <p className="text-lg text-gray-600">
                  {report.methodology}
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-10 h-1 bg-eurofins-orange mr-3"></span>
                  Dlaczego warto?
                </h2>
                <p className="text-lg text-gray-600">
                  {report.whyItMatters}
                </p>
              </div>
            </div>
            
            {/* Key findings sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Kluczowe obszary</h2>
                <ul className="space-y-4">
                  {report.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start pb-3 border-b border-gray-200 last:border-0">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-eurofins-orange text-white text-sm font-medium mr-3">{index + 1}</span>
                      <span className="text-gray-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FormSection defaultReport={report.formValue ? [report.formValue] : []} />
    </div>
  )
}

// Generate static paths for all reports using slugs
export async function generateStaticParams() {
  return reports.map((report) => ({
    slug: report.slug,
  }))
}
