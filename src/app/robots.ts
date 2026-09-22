import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/chart/step/',
          '/synastry/step/',
          '/hd/step/',
          '/result/',
          '/en/chart/step/',
          '/en/synastry/step/',
          '/en/hd/step/',
          '/en/result/',
        ],
      },
    ],
    sitemap: 'https://astroaura.pro/sitemap.xml',
    host: 'https://astroaura.pro',
  };
}
