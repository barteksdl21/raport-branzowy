'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, Suspense } from 'react' // Import Suspense

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (typeof window.gtag !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID as string, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
interface EventProps {
  action: string
  category: string
  label: string
  value: number
}
export const event = ({ action, category, label, value }: EventProps) => {
  if (typeof window.gtag !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// New component to handle navigation events and hooks
const AnalyticsNavigationEvents = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (GA_TRACKING_ID && pathname) {
      const url = new URL(pathname, window.location.origin)
      if (searchParams) {
        url.search = searchParams.toString()
      }
      pageview(url)
    }
  }, [pathname, searchParams])

  return null // This component does not render any UI itself
}

export const GoogleAnalytics = () => {
  if (!GA_TRACKING_ID && !GTM_ID) {
    console.warn('Google Analytics and Google Tag Manager IDs are not set')
    return null
  }

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}

      {/* GA_TRACKING_ID && !GTM_ID && */} (
      {GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `}
          </Script>
        </>
      )}
      <Suspense fallback={null}>
        <AnalyticsNavigationEvents />
      </Suspense>
    </>
  )
}

// Define gtag on window
declare global {
  interface Window {
    gtag?: (
      event: string,
      trackingId: string,
      config?: { [key: string]: unknown }
    ) => void
  }
}
