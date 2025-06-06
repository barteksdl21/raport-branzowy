import { MetadataRoute } from 'next';

const reportsData = [
  {
    slug: "raport-branzy-miesnej",
    lastModified: '2025-06-01', 
  },
  {
    slug: "raport-branzy-mleczarskiej",
    lastModified: '2025-06-01', 
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://raportbranzowy.pl'; 

  const reportEntries: MetadataRoute.Sitemap = reportsData.map((report) => ({
    url: `${siteUrl}/raporty/${report.slug}`,
    lastModified: new Date(report.lastModified),
    changeFrequency: 'yearly', 
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date('2025-06-01'),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${siteUrl}/polityka-prywatnosci`,
      lastModified: new Date('2025-06-01'),
      changeFrequency: 'never',
      priority: 0.5,
    },
    ...reportEntries,
  ];
}
