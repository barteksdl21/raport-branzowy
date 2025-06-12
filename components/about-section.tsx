"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Building2, FlaskRoundIcon as Flask, Award, Users } from "lucide-react"

export function AboutSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} id="o-nas" className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className={`relative ${inView ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
              <Image
                src="/LP_627x500.jpg"
                alt="Laboratorium Eurofins Polska"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg max-w-[200px]">
              <div className="text-4xl font-bold text-eurofins-orange">25+</div>
              <div className="text-primary font-medium">lat doświadczenia w badaniach laboratoryjnych</div>
            </div>
          </div>

          <div className={`space-y-6 ${inView ? "animate-slide-in-right" : "opacity-0"}`}>
            <div className="inline-block rounded-lg bg-eurofins-orange px-3 py-1 text-sm text-white">
              O Eurofins Polska
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Lider w badaniach laboratoryjnych dla branży spożywczej
            </h2>
            <p className="text-muted-foreground">
              Eurofins Polska to część międzynarodowej grupy Eurofins Scientific, światowego lidera w dziedzinie badań
              laboratoryjnych. Specjalizujemy się w kompleksowych analizach dla sektora spożywczego, zapewniając
              najwyższą jakość i bezpieczeństwo produktów.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Building2 className="h-6 w-6 text-eurofins-orange mt-1" />
                <div>
                  <h3 className="font-bold text-primary">Nowoczesne laboratoria</h3>
                  <p className="text-sm text-muted-foreground">Wyposażone w najnowocześniejszy sprzęt analityczny</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Flask className="h-6 w-6 text-eurofins-orange mt-1" />
                <div>
                  <h3 className="font-bold text-primary">Akredytowane metody</h3>
                  <p className="text-sm text-muted-foreground">Badania zgodne z międzynarodowymi standardami</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Award className="h-6 w-6 text-eurofins-orange mt-1" />
                <div>
                  <h3 className="font-bold text-primary">Certyfikowana jakość</h3>
                  <p className="text-sm text-muted-foreground">Gwarancja rzetelnych i dokładnych wyników</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Users className="h-6 w-6 text-eurofins-orange mt-1" />
                <div>
                  <h3 className="font-bold text-primary">Zespół ekspertów</h3>
                  <p className="text-sm text-muted-foreground">Merytoryczne wsparcie i zawsze aktualna wiedza</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">
            Nasze raporty branżowe powstały na bazie bogatego doświadczenia i dokładnych analiz, które każdego dnia pomagają producentom żywności podnosić jakość swoich produktów oraz spełniać wymagania rynkowe i prawne.
            </p>

            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link href="https://www.eurofins.pl" target="_blank">
                Dowiedz się więcej o Eurofins
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
