import type React from "react"
import Script from "next/script"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { GoogleAnalytics } from "../lib/gtag"
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: "Raporty Branżowe | Eurofins Polska",
  description:
    "Raporty branżowe dla przemysłu spożywczego od Eurofins Polska. Analizy laboratoryjne dla sektorów: mięsnego, mleczarskiego, owocowo-warzywnego i innych.",
  keywords: "raporty branżowe, Eurofins Polska, analizy laboratoryjne, przemysł spożywczy, badania żywności",
  icons: {
    icon: '/emblem.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Script
          strategy="afterInteractive"
          id="clarity-script"
        >
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tv5zt9oy7w");
          `}
        </Script>
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  )
}
