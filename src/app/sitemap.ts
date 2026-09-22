import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://astroaura.pro';
  const now = new Date();

  return [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ru: `${baseUrl}`,
          en: `${baseUrl}/en`,
          'x-default': `${baseUrl}`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          ru: `${baseUrl}`,
          en: `${baseUrl}/en`,
          'x-default': `${baseUrl}`,
        },
      },
    },
  ];
}
