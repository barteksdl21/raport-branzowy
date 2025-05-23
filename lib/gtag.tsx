'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

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

export const GoogleAnalytics = () => {
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

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
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
