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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const ymId = process.env.NEXT_PUBLIC_YM_ID;

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
        {/* Google Site Verification fallback if set via env */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}

        {/* Structured Data (Schema.org) for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Yandex Metrika with WebVisor */}
        {ymId && (
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(${ymId}, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-400 selection:text-black">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
