import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: "Raporty Branżowe | Eurofins Polska",
  description:
    "Profesjonalne raporty branżowe dla przemysłu spożywczego od Eurofins Polska. Analizy laboratoryjne dla sektorów: mięsnego, mleczarskiego, owocowo-warzywnego i innych.",
  keywords: "raporty branżowe, Eurofins Polska, analizy laboratoryjne, przemysł spożywczy, badania żywności",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
