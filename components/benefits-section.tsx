"use client"

import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShieldCheck, LineChart, Lightbulb, Target, Zap } from "lucide-react"

export function BenefitsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const benefits = [
    {
      icon: <TrendingUp className="h-10 w-10 text-eurofins-orange" />,
      title: "Analiza trendów rynkowych",
      description: "Poznaj aktualne trendy konsumenckie i rynkowe, które wpływają na Twoją branżę.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-eurofins-orange" />,
      title: "Bezpieczeństwo produktów",
      description: "Dowiedz się, jak zapewnić najwyższe standardy bezpieczeństwa swoim produktom.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-eurofins-orange" />,
      title: "Dane porównawcze",
      description: "Porównaj swoje wyniki z danymi branżowymi i poznaj swoją pozycję na rynku.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-eurofins-orange" />,
      title: "Innowacyjne rozwiązania",
      description: "Odkryj nowe technologie i metody badawcze, które mogą usprawnić Twoje procesy.",
    },
    {
      icon: <Target className="h-10 w-10 text-eurofins-orange" />,
      title: "Zgodność z przepisami",
      description: "Bądź na bieżąco z aktualnymi wymogami prawnymi i normami dla Twojej branży.",
    },
    {
      icon: <Zap className="h-10 w-10 text-eurofins-orange" />,
      title: "Przewaga konkurencyjna",
      description: "Wykorzystaj wiedzę z raportów, aby wyprzedzić konkurencję i zdobyć przewagę na rynku.",
    },
  ]

  return (
    <section ref={ref} id="korzyści" className="w-full py-12 md:py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Korzyści z naszych raportów
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Odkryj kluczowe wartości, które zyskasz dzięki raportom Eurofins Polska.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`border-none shadow-md ${inView ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <CardHeader className="pb-2">
                {benefit.icon}
                <CardTitle className="text-xl text-primary">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
