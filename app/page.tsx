import { HeroSection } from "@/components/hero-section"
import { ReportsSection } from "@/components/reports-section"
import { AboutSection } from "@/components/about-section"
import { FormSection } from "@/components/form-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FaqSection } from "@/components/faq-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <ReportsSection />
      <BenefitsSection />
      <AboutSection />
      <TestimonialsSection />
      <FormSection />
      <FaqSection />
    </div>
  )
}
