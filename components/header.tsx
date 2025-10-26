"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Eurofins Polska Logo"
            width={228}
            height={77}
            className="w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/#raporty" className="text-primary hover:text-eurofins-orange font-medium transition-colors">
            Raporty
          </Link>
          <Link href="/#o-nas" className="text-primary hover:text-eurofins-orange font-medium transition-colors">
            O nas
          </Link>
          <Link href="/#korzyści" className="text-primary hover:text-eurofins-orange font-medium transition-colors">
            Korzyści
          </Link>
          <Link href="/#faq" className="text-primary hover:text-eurofins-orange font-medium transition-colors">
            FAQ
          </Link>
          <Link href="/#kontakt" className="text-primary hover:text-eurofins-orange font-medium transition-colors">
            Kontakt
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild className="bg-eurofins-orange hover:bg-eurofins-orange/90 text-white">
            <Link href="#formularzSpacer">Pobierz raport</Link>
          </Button>
        </div>

        <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 animate-fade-in">
          <nav className="container flex flex-col space-y-4">
            <Link
              href="/#raporty"
              className="text-primary hover:text-eurofins-orange font-medium transition-colors px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Raporty
            </Link>
            <Link
              href="/#o-nas"
              className="text-primary hover:text-eurofins-orange font-medium transition-colors px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              O nas
            </Link>
            <Link
              href="/#korzyści"
              className="text-primary hover:text-eurofins-orange font-medium transition-colors px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Korzyści
            </Link>
            <Link
              href="/#faq"
              className="text-primary hover:text-eurofins-orange font-medium transition-colors px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/#kontakt"
              className="text-primary hover:text-eurofins-orange font-medium transition-colors px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontakt
            </Link>
            <Button asChild className="bg-eurofins-orange hover:bg-eurofins-orange/90 text-white mx-4">
              <Link href="/#formularz" onClick={() => setIsMobileMenuOpen(false)}>
                Pobierz raport
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
