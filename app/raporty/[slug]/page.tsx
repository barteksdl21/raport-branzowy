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
  };
}

const reports = [
  {
    id: 1,
    title: "Raport branży mięsnej",
    slug: "raport-branzy-miesnej",
    formValue: "meat",
    description:
      "Kompleksowa analiza rynku mięsnego w Polsce. Badania mikrobiologiczne, fizykochemiczne oraz trendy konsumenckie.",
    longDescription:
      "Nasz raport dotyczący branży mleczarskiej to kompleksowe źródło wiedzy na temat dostępnych rozwiązań i metod analitycznych, zapewniających bezpieczeństwo i jakość produktów. Zawiera szczegółową analizę wyników badań laboratoryjnych, obejmującą m.in. obecność drobnoustrojów, metali ciężkich oraz dodatków do żywności. Dodatkowo, raport prezentuje porównanie z obowiązującymi normami unijnymi oraz zawiera praktyczne rekomendacje dla producentów.",
    methodology:
      "Badania mikrobiologiczne, fizykochemiczne oraz trendy konsumenckie.",
    whyItMatters:
      "Raport dostarcza cennych informacji dla producentów, dystrybutorów oraz instytucji kontrolnych. Zawarte w nim dane pozwalają na lepsze zrozumienie rynku, identyfikację zagrożeń oraz dostosowanie produktów do oczekiwań konsumentów i wymogów prawnych.",
    image: "/placeholder.svg?height=500&width=800",
    comingSoon: false,
    keyFindings: [
      "Badania mikrobiologiczne i fizykochemiczne",
      "Ocena zgodności z normami UE",
      "Trendy konsumenckie w branży mięsnej",
      "Rekomendacje dla producentów"
    ]
  },
  // Example of another report with its own slug
  {
    id: 2,
    title: "Raport branży mleczarskiej",
    slug: "raport-branzy-mleczarskiej",
    formValue: "dairy",
    description:
      "Szczegółowe badania produktów mlecznych. Analiza jakości, bezpieczeństwa i innowacji w sektorze mleczarskim.",
    longDescription:
      "Nasz raport branży mleczarskiej dostarcza szczegółowych informacji na temat jakości i bezpieczeństwa produktów mlecznych dostępnych na polskim rynku. Zawiera analizę wyników badań laboratoryjnych, w tym obecności drobnoustrojów, metali ciężkich oraz dodatków do żywności. Raport zawiera również porównanie z normami unijnymi i rekomendacje dla producentów.",
    methodology:
      "Raport powstał w oparciu o badania przeprowadzone w laboratoriach Eurofins Polska, realizowane zgodnie z najwyższymi standardami jakości i rzetelności. Analizy obejmują szeroki zakres testów mikrobiologicznych, fizykochemicznych oraz sensorycznych, przeprowadzonych na próbkach produktów dostępnych na polskim rynku mleczarskim.",
    whyItMatters:
      "Raport stanowi cenne narzędzie dla producentów oraz dystrybutorów z branży mleczarskiej. Dostarcza szczegółowych danych, które pomagają lepiej zrozumieć aktualne trendy i wyzwania, opracować sposoby zarządzania zagrożeniami mikrobiologicznymi w środowisku produkcji oraz optymalizować ofertę produktową, tak by spełniała oczekiwania konsumentów i wymogi prawne.",
    image: "/placeholder.svg?height=500&width=800",
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

  
      {/* Form section - full width distinct section */}
      <FormSection defaultReport={report.formValue} />
    </div>
  )
}

// Generate static paths for all reports using slugs
export async function generateStaticParams() {
  return reports.map((report) => ({
    slug: report.slug,
  }))
}
