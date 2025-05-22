"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"

const reports = [
  {
    id: 1,
    title: "Raport branży mięsnej",
    description:
      "Kompleksowa analiza rynku mięsnego w Polsce. Badania mikrobiologiczne, fizykochemiczne oraz trendy konsumenckie.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Mięso",
  },
  {
    id: 2,
    title: "Raport branży mleczarskiej",
    description:
      "Szczegółowe badania produktów mlecznych. Analiza jakości, bezpieczeństwa i innowacji w sektorze mleczarskim.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Mleko",
  },
  {
    id: 3,
    title: "Raport branży owocowo-warzywnej",
    description: "Badania pozostałości pestycydów, metali ciężkich oraz jakości mikrobiologicznej owoców i warzyw.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Owoce i warzywa",
  },
  {
    id: 4,
    title: "Raport branży rybnej",
    description:
      "Analiza jakości i bezpieczeństwa produktów rybnych. Badania na obecność metali ciężkich i mikroplastiku.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Ryby i owoce morza",
  },
  {
    id: 5,
    title: "Raport branży zbożowej",
    description: "Kompleksowe badania zbóż, mąk i produktów zbożowych. Analiza mykotoksyn i jakości wypieków.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Zboża",
  },
  {
    id: 6,
    title: "Raport branży napojów",
    description: "Badania napojów alkoholowych i bezalkoholowych. Analiza składu, dodatków i zgodności z normami.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Napoje",
  },
]

export function ReportsSection() {
  const [activeCategory, setActiveCategory] = useState("Wszystkie")
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const categories = ["Wszystkie", ...new Set(reports.map((report) => report.category))]

  const filteredReports =
    activeCategory === "Wszystkie" ? reports : reports.filter((report) => report.category === activeCategory)

  return (
    <section ref={ref} id="raporty" className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Nasze raporty branżowe
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Wybierz interesujący Cię raport i uzyskaj dostęp do najnowszych analiz laboratoryjnych dla Twojej branży.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-8 mb-10">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`${
                activeCategory === category
                  ? "bg-eurofins-orange hover:bg-eurofins-orange/90 text-white"
                  : "text-primary"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredReports.map((report, index) => (
            <Card
              key={report.id}
              className={`report-card overflow-hidden ${inView ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="relative h-48 w-full">
                <Image src={report.image || "/placeholder.svg"} alt={report.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 bg-eurofins-orange text-white px-3 py-1 rounded-full text-sm">
                  {report.category}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-primary">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/#formularz">
                    <FileText className="mr-2 h-4 w-4" /> Pobierz raport
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button asChild className="bg-eurofins-orange hover:bg-eurofins-orange/90 text-white">
            <Link href="/#formularz">
              Pobierz pełne raporty <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
