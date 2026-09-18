import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    metadataBase: new URL('https://astroaura.pro'),
    title: {
      default: isEn
        ? "AstroAura — Natal Chart Online, Compatibility & Human Design"
        : "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
      template: "%s | AstroAura",
    },
    description: isEn
      ? "Professional calculation of natal chart, synastry (compatibility) and Human Design bodygraph using NASA and Swiss Ephemeris data. Discover your life purpose and shadow magnetism."
      : "Профессиональный расчет натальной карты, синастрии (совместимости) и бодиграфа Дизайна Человека на основе эфемерид NASA и Swiss Ephemeris. Узнайте свой кармический код, финансовый вектор и теневой магнетизм Лилит.",
    keywords: isEn
      ? [
          "natal chart",
          "natal chart online",
          "human design bodygraph",
          "compatibility test",
          "synastry chart",
          "astrodynes",
          "part of fortune"
        ]
      : [
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
      canonical: isEn ? "https://astroaura.pro/en" : "https://astroaura.pro",
      languages: {
        'ru': 'https://astroaura.pro',
        'en': 'https://astroaura.pro/en',
        'x-default': 'https://astroaura.pro/en',
      },
    },
    openGraph: {
      title: isEn
        ? "AstroAura — Natal Chart Online, Compatibility & Human Design"
        : "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
      description: isEn
        ? "Precise astrological calculation and Human Design blueprint."
        : "Точный расчет натальной карты, гороскопа совместимости и бодиграфа Дизайна Человека. Глубокий психологический и кармический разбор.",
      url: isEn ? "https://astroaura.pro/en" : "https://astroaura.pro",
      siteName: "AstroAura",
      locale: isEn ? "en_US" : "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEn
        ? "AstroAura — Natal Chart Online, Compatibility & Human Design"
        : "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
      description: isEn
        ? "Precise astrological calculation and Human Design blueprint."
        : "Точный расчет натальной карты, гороскопа совместимости и бодиграфа Дизайна Человека.",
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale === 'en' ? 'en' : 'ru';
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W4BGMWF2';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://astroaura.pro/#organization',
        'name': 'AstroAura',
        'url': 'https://astroaura.pro',
        'description': validLocale === 'en'
          ? 'Online astrology calculations, natal charts, and Human Design'
          : 'Онлайн-сервис астрологических расчетов, натальных карт и Дизайна Человека'
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://astroaura.pro/#webapp',
        'url': 'https://astroaura.pro',
        'name': validLocale === 'en'
          ? 'AstroAura — Natal Chart & Human Design'
          : 'AstroAura — Натальная карта и Дизайн Человека',
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'All',
        'browserRequirements': 'Requires JavaScript. Requires HTML5.',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': validLocale === 'en' ? 'USD' : 'RUB'
        }
      }
    ]
  };

  return (
    <html
      lang={validLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'jwKKw0yTinQ1XeMQZ2ibYVBb7wdUiydYCWkfU1KWgRo'}
        />

        {/* Structured Data (Schema.org) */}
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
