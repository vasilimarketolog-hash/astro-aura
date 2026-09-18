import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://astroaura.pro'),
  title: {
    default: "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
    template: "%s | AstroAura",
  },
  description: "Профессиональный расчет натальной карты, синастрии (совместимости) и бодиграфа Дизайна Человека на основе эфемерид NASA и Swiss Ephemeris. Узнайте свой кармический код, финансовый вектор и теневой магнетизм Лилит.",
  keywords: [
    "натальная карта",
    "натальная карта онлайн",
    "рассчитать натальную карту с расшифровкой",
    "дизайн человека",
    "бодиграф онлайн",
    "совместимость по дате рождения",
    "синастрия онлайн",
    "точка фортуны",
    "лилит в знаках",
    "астродины",
    "астрологический паспорт"
  ],
  authors: [{ name: "AstroAura" }],
  creator: "AstroAura",
  publisher: "AstroAura",
  alternates: {
    canonical: "https://astroaura.pro",
  },
  openGraph: {
    title: "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
    description: "Точный расчет натальной карты, гороскопа совместимости и бодиграфа Дизайна Человека. Глубокий психологический и кармический разбор.",
    url: "https://astroaura.pro",
    siteName: "AstroAura",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
    description: "Точный расчет натальной карты, гороскопа совместимости и бодиграфа Дизайна Человека.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'jwKKw0yTinQ1XeMQZ2ibYVBb7wdUiydYCWkfU1KWgRo',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W4BGMWF2';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://astroaura.pro/#organization',
        'name': 'AstroAura',
        'url': 'https://astroaura.pro',
        'description': 'Онлайн-сервис астрологических расчетов, натальных карт и Дизайна Человека'
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://astroaura.pro/#webapp',
        'url': 'https://astroaura.pro',
        'name': 'AstroAura — Натальная карта и Дизайн Человека',
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'All',
        'browserRequirements': 'Requires JavaScript. Requires HTML5.',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'RUB'
        }
      }
    ]
  };

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'jwKKw0yTinQ1XeMQZ2ibYVBb7wdUiydYCWkfU1KWgRo'}
        />

        {/* Structured Data (Schema.org) for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Tag Manager Container */}
        {gtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-400 selection:text-black">
        {/* Google Tag Manager (noscript fallback) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
