import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg?height=40&width=150"
                alt="Eurofins Polska Logo"
                width={150}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/80 text-sm">
              Eurofins Polska to część międzynarodowej grupy Eurofins Scientific, światowego lidera w dziedzinie badań
              laboratoryjnych dla przemysłu spożywczego.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-white/80 hover:text-eurofins-orange transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-white/80 hover:text-eurofins-orange transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="text-white/80 hover:text-eurofins-orange transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="text-white/80 hover:text-eurofins-orange transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Raporty branżowe</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#raporty" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Branża mięsna
                </Link>
              </li>
              <li>
                <Link href="/#raporty" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Branża mleczarska
                </Link>
              </li>
              <li>
                <Link href="/#raporty" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Branża owocowo-warzywna
                </Link>
              </li>
              <li>
                <Link href="/#raporty" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Branża rybna
                </Link>
              </li>
              <li>
                <Link href="/#raporty" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Branża zbożowa
                </Link>
              </li>
              <li>
                <Link href="/#raporty" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Branża napojów
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Przydatne linki</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#o-nas" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/#korzyści" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Korzyści
                </Link>
              </li>
              <li>
                <Link href="/#formularz" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Pobierz raport
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.eurofins.pl"
                  target="_blank"
                  className="text-white/80 hover:text-eurofins-orange transition-colors"
                >
                  Eurofins Polska
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-eurofins-orange transition-colors">
                  Polityka prywatności
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4" id="kontakt">
            <h3 className="text-lg font-bold">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-eurofins-orange shrink-0 mt-0.5" />
                <span className="text-white/80">
                  ul. Przykładowa 123
                  <br />
                  00-000 Warszawa
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-eurofins-orange shrink-0" />
                <span className="text-white/80">+48 22 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-eurofins-orange shrink-0" />
                <span className="text-white/80">info@eurofins.pl</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Eurofins Polska. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  )
}
