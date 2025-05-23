import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ReportForm } from "@/components/report-form"

// This would typically come from a database or API
const reports = [
  {
    id: 1,
    title: "Raport branży mięsnej",
    slug: "raport-branzy-miesnej",
    description:
      "Kompleksowa analiza rynku mięsnego w Polsce. Badania mikrobiologiczne, fizykochemiczne oraz trendy konsumenckie.",
    longDescription:
      "Nasz raport branży mięsnej dostarcza szczegółowych informacji na temat jakości i bezpieczeństwa produktów mięsnych dostępnych na polskim rynku. Zawiera analizę wyników badań laboratoryjnych, w tym obecności drobnoustrojów, metali ciężkich oraz dodatków do żywności. Raport zawiera również porównanie z normami unijnymi i rekomendacje dla producentów.",
    image: "/placeholder.svg?height=500&width=800",
    comingSoon: false,
    keyFindings: [
      "Analiza ponad 500 próbek produktów mięsnych",
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
    description:
      "Kompleksowa analiza rynku mleczarskiego w Polsce. Badania mikrobiologiczne, fizykochemiczne oraz trendy konsumenckie.",
    longDescription:
      "Nasz raport branży mleczarskiej dostarcza szczegółowych informacji na temat jakości i bezpieczeństwa produktów mlecznych dostępnych na polskim rynku. Zawiera analizę wyników badań laboratoryjnych, w tym obecności drobnoustrojów, metali ciężkich oraz dodatków do żywności. Raport zawiera również porównanie z normami unijnymi i rekomendacje dla producentów.",
    image: "/placeholder.svg?height=500&width=800",
    comingSoon: false,
    keyFindings: [
      "Analiza ponad 500 próbek produktów mlecznych",
      "Badania mikrobiologiczne i fizykochemiczne",
      "Ocena zgodności z normami UE",
      "Trendy konsumenckie w branży mleczarskiej",
      "Rekomendacje dla producentów"
    ]
  }
]

export default async function ReportDetailPage({ params }: { params: { slug: string } }) {
  // Ensure params are awaited before use
  const slug = await Promise.resolve(params.slug)
  
  const report = reports.find((r) => r.slug === slug)

  if (!report) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost">
            <Link href="/#raporty" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do listy raportów
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Main content area for report details */}
      <section className="py-16 bg-white">
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
                  Raport został przygotowany na podstawie badań przeprowadzonych w laboratoriach Eurofins zgodnie z najwyższymi standardami jakości. 
                  Analizy obejmują badania mikrobiologiczne, fizykochemiczne oraz sensoryczne produktów dostępnych na polskim rynku.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-10 h-1 bg-eurofins-orange mr-3"></span>
                  Dlaczego warto?
                </h2>
                <p className="text-lg text-gray-600">
                  Raport dostarcza cennych informacji dla producentów, dystrybutorów oraz instytucji kontrolnych. 
                  Zawarte w nim dane pozwalają na lepsze zrozumienie rynku, identyfikację zagrożeń oraz dostosowanie 
                  produktów do oczekiwań konsumentów i wymogów prawnych.
                </p>
              </div>
            </div>
            
            {/* Key findings sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Kluczowe wnioski</h2>
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
      <section className="w-full bg-gray-100 py-16" id="formularz">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-6 text-gray-900">Pobierz raport branżowy</h1>
              <p className="text-lg mb-8 text-gray-700">
                Wypełnij formularz, aby otrzymać wybrany raport branżowy na swój adres e-mail. 
                Nasze raporty zawierają cenne informacje, które pomogą Ci podejmować lepsze decyzje biznesowe.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-eurofins-orange flex items-center justify-center text-white text-sm font-medium mr-3">1</div>
                  <span className="text-gray-700">Szczegółowe analizy laboratoryjne</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-eurofins-orange flex items-center justify-center text-white text-sm font-medium mr-3">2</div>
                  <span className="text-gray-700">Trendy rynkowe i konsumenckie</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-eurofins-orange flex items-center justify-center text-white text-sm font-medium mr-3">3</div>
                  <span className="text-gray-700">Porównanie z normami europejskimi</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-eurofins-orange flex items-center justify-center text-white text-sm font-medium mr-3">4</div>
                  <span className="text-gray-700">Rekomendacje dla producentów</span>
                </div>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-eurofins-orange flex items-center justify-center text-white text-sm font-medium mr-3">5</div>
                  <span className="text-gray-700">Dostęp do ekspertów Eurofins</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ReportForm defaultReport={report.title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Generate static paths for all reports using slugs
export async function generateStaticParams() {
  return reports.map((report) => ({
    slug: report.slug,
  }))
}
