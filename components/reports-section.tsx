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
    title: "Raport branży mleczarskiej",
    slug: "raport-branzy-mleczarskiej",
    description:
      "Szczegółowe badania produktów mlecznych. Analiza jakości, bezpieczeństwa i innowacji w sektorze mleczarskim.",
    image: "/placeholder.svg?height=200&width=300",
    comingSoon: false,
  },
  {
    id: 2,
    title: "Raport branży mięsnej",
    slug: "raport-branzy-miesnej",
    description:
      "Kompleksowa analiza rynku mięsnego w Polsce. Badania mikrobiologiczne, fizykochemiczne oraz trendy konsumenckie.",
    image: "/placeholder.svg?height=200&width=300",
    comingSoon: true,
  },
  {
    id: 3,
    title: "Raport branży owocowo-warzywnej",
    slug: "raport-branzy-owocowo-warzywnej",
    description: "Badania pozostałości pestycydów, metali ciężkich oraz jakości mikrobiologicznej owoców i warzyw.",
    image: "/placeholder.svg?height=200&width=300",
    comingSoon: true,
  },
  {
    id: 4,
    title: "Raport branży rybnej",
    slug: "raport-branzy-rybnej",
    description:
      "Analiza jakości i bezpieczeństwa produktów rybnych. Badania na obecność metali ciężkich i mikroplastiku.",
    image: "/placeholder.svg?height=200&width=300",
    comingSoon: true,
  },
]

export function ReportsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {reports.map((report, index) => (
            <Card
              key={report.id}
              className={`report-card overflow-hidden ${inView ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="relative h-48 w-full">
                <Image src={report.image || "/placeholder.svg"} alt={report.title} fill className="object-cover" />
                {report.comingSoon && (
                  <div className="absolute top-2 right-2 bg-gray-400 text-white px-3 py-1 rounded-full text-sm">
                    Dostępne wkrótce
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-primary">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className={`w-full ${
                  report.comingSoon
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                disabled={report.comingSoon}>
                  <Link href={report.comingSoon ? '#' : `/raporty/${report.slug}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    {report.comingSoon ? "Dostępne wkrótce" : "Zobacz szczegóły"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
