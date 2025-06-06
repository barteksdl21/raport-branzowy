import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://raportbranzowy.pl';

  return {
    rules: [
      {
        userAgent: '*', // Applies to all crawlers
        allow: '/',     // Allow crawling of all content by default
        // You could add disallow rules here if needed, for example:
        // disallow: '/admin/',
        // disallow: '/api/some-sensitive-endpoint',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`, // URL to your sitemap
  };
}
