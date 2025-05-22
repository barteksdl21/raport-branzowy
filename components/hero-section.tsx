"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-primary to-primary/90">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div
            className={`space-y-4 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="inline-block rounded-lg bg-eurofins-orange px-3 py-1 text-sm text-white">
              Raporty Branżowe 2025
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Profesjonalne analizy dla przemysłu spożywczego
            </h1>
            <p className="max-w-[600px] text-white/90 md:text-xl">
              Uzyskaj dostęp do najnowszych raportów branżowych Eurofins Polska. Kompleksowe analizy laboratoryjne dla
              sektorów: mięsnego, mleczarskiego, owocowo-warzywnego i wielu innych.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-eurofins-orange hover:bg-eurofins-orange/90 text-white">
                <Link href="/#formularz">
                  Pobierz raport <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/#raporty">Zobacz dostępne raporty</Link>
              </Button>
            </div>
          </div>
          <div
            className={`relative ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Raporty branżowe Eurofins"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-eurofins-orange flex items-center justify-center text-white font-bold text-lg p-4 shadow-lg">
              10+ branż
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-24 h-24 bg-eurofins-orange/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-eurofins-orange/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
    </section>
  )
}
