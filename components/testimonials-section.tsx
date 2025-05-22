"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useInView } from "react-intersection-observer"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content:
      "Raporty branżowe Eurofins Polska dostarczyły nam cennych informacji, które pomogły nam ulepszyć nasze procesy produkcyjne i podnieść jakość naszych produktów mięsnych.",
    author: "Anna Kowalska",
    position: "Dyrektor ds. Jakości, Mięsopol S.A.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    content:
      "Dzięki raportom branżowym mogliśmy porównać nasze wyniki z danymi rynkowymi i zidentyfikować obszary wymagające poprawy. To nieocenione narzędzie dla każdego producenta nabiału.",
    author: "Piotr Nowak",
    position: "Prezes, Mleczarnia Regionalna",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    content:
      "Kompleksowe analizy laboratoryjne zawarte w raportach Eurofins pomogły nam spełnić wymagania eksportowe i wejść na nowe rynki zagraniczne z naszymi produktami owocowymi.",
    author: "Magdalena Wiśniewska",
    position: "Kierownik Eksportu, FruitPol",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const nextTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={ref} className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div
          className={`flex flex-col items-center justify-center space-y-4 text-center mb-10 ${
            inView ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Co mówią nasi klienci</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Poznaj opinie firm, które skorzystały z naszych raportów branżowych i podniosły jakość swoich produktów.
            </p>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            className={`overflow-hidden ${inView ? "animate-fade-in" : "opacity-0"}`}
            style={{ animationDelay: "0.3s" }}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-none shadow-lg bg-muted/30">
                    <CardContent className="p-6 sm:p-10">
                      <Quote className="h-10 w-10 text-eurofins-orange mb-4 opacity-50" />
                      <p className="text-lg sm:text-xl italic mb-6">{testimonial.content}</p>
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-primary">{testimonial.author}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-muted transition-colors"
            aria-label="Poprzedni"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-muted transition-colors"
            aria-label="Następny"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true)
                  setCurrentIndex(index)
                  setTimeout(() => setIsAnimating(false), 500)
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentIndex === index ? "bg-eurofins-orange" : "bg-muted-foreground/30"
                }`}
                aria-label={`Przejdź do opinii ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
