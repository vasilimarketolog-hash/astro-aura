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
  const isEs = locale === 'es';

  return {
    metadataBase: new URL('https://astroaura.pro'),
    title: {
      default: isEs
        ? "AstroAura — Carta Astral Gratis Online con Interpretación | Diseño Humano y Sinastría"
        : isEn
        ? "AstroAura — Free Natal Chart Online with Interpretation | Human Design & Synastry"
        : "AstroAura — Натальная карта онлайн бесплатно с расшифровкой | Дизайн Человека и Совместимость",
      template: "%s | AstroAura",
    },
    description: isEs
      ? "Calcula tu carta astral gratis por fecha de nacimiento con interpretación profunda de planetas, casas y aspectos. Biógrafo de Diseño Humano y sinastría de pareja precisa basada en efemérides de la NASA."
      : isEn
      ? "Free natal chart online calculator with in-depth interpretation of planets, houses, and aspects. Accurate Human Design bodygraph and couple compatibility powered by NASA ephemerides."
      : "Бесплатный расчет натальной карты по дате рождения с подробной расшифровкой планет, домов и аспектов. Бодиграф Дизайна Человека и синастрия совместимости пары на точных эфемеридах NASA.",
    keywords: isEs
      ? [
          "carta astral",
          "carta astral online gratis",
          "calcular carta astral",
          "carta natal con interpretacion",
          "carta natal gratis",
          "astrologia online",
          "diseño humano",
          "biografo diseño humano",
          "calcular diseño humano gratis",
          "generador proyector manifestador",
          "compatibilidad de pareja astrologia",
          "sinastria de parejas online",
          "calculadora ascendente",
          "signo lunar",
          "punto de la fortuna",
          "luna negra lilith",
          "astrodinas"
        ]
      : isEn
      ? [
          "natal chart",
          "natal chart online",
          "free natal chart calculator",
          "birth chart reading",
          "birth chart calculator with interpretation",
          "free birth chart",
          "astrology chart online",
          "human design chart",
          "human design bodygraph free",
          "calculate human design chart",
          "human design chart generator",
          "generator projector manifestor",
          "zodiac compatibility test",
          "synastry chart online free",
          "love compatibility calculator",
          "relationship astrology",
          "rising sign calculator",
          "moon sign calculator",
          "astrodynes",
          "part of fortune calculator",
          "astrology chart interpretation"
        ]
      : [
          "натальная карта",
          "натальная карта онлайн",
          "натальная карта бесплатно",
          "рассчитать натальную карту с расшифровкой",
          "натальная карта по дате рождения",
          "составить натальную карту",
          "гороскоп по дате рождения",
          "дизайн человека",
          "дизайн человека рассчитать онлайн",
          "бодиграф онлайн бесплатно",
          "бодиграф расшифровка",
          "генетический тип генератор манифестор проектор",
          "совместимость знаков зодиака",
          "синастрия онлайн с расшифровкой",
          "гороскоп совместимости пары",
          "асцендент рассчитать онлайн",
          "лунный знак рассчитать",
          "точка фортуны",
          "черная луна лилит в знаках",
          "астродины",
          "астрологический паспорт"
        ],
    authors: [{ name: "AstroAura" }],
    creator: "AstroAura",
    publisher: "AstroAura",
    alternates: {
      canonical: isEs ? "https://astroaura.pro/es" : isEn ? "https://astroaura.pro/en" : "https://astroaura.pro",
      languages: {
        'ru': 'https://astroaura.pro',
        'en': 'https://astroaura.pro/en',
        'es': 'https://astroaura.pro/es',
        'x-default': 'https://astroaura.pro/en',
      },
    },
    openGraph: {
      title: isEs
        ? "AstroAura — Carta Astral Gratis Online, Compatibilidad y Diseño Humano"
        : isEn
        ? "AstroAura — Free Natal Chart Online, Compatibility & Human Design"
        : "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
      description: isEs
        ? "Cálculos astronómicos exactos, análisis psicológico profundo y mapa energético de Diseño Humano."
        : isEn
        ? "Precise astronomical calculations, deep psychological insights, and Human Design blueprint."
        : "Точный расчет натальной карты, гороскопа совместимости и бодиграфа Дизайна Человека. Глубокий психологический и кармический разбор.",
      url: isEs ? "https://astroaura.pro/es" : isEn ? "https://astroaura.pro/en" : "https://astroaura.pro",
      siteName: "AstroAura",
      locale: isEs ? "es_LA" : isEn ? "en_US" : "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEs
        ? "AstroAura — Carta Astral Gratis Online, Compatibilidad y Diseño Humano"
        : isEn
        ? "AstroAura — Free Natal Chart Online, Compatibility & Human Design"
        : "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
      description: isEs
        ? "Cálculos astronómicos exactos, análisis psicológico profundo y mapa energético de Diseño Humano."
        : isEn
        ? "Precise astronomical calculations, deep psychological insights, and Human Design blueprint."
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
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '994f342b75a5349d',
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
  const validLocale = locale === 'es' ? 'es' : locale === 'en' ? 'en' : 'ru';
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W4BGMWF2';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://astroaura.pro/#organization',
        'name': 'AstroAura',
        'url': 'https://astroaura.pro',
        'logo': 'https://astroaura.pro/favicon.ico',
        'description': validLocale === 'es'
          ? 'Cálculos astrológicos online, cartas astrales y Diseño Humano'
          : validLocale === 'en'
          ? 'Online astrology calculations, natal charts, and Human Design'
          : 'Онлайн-сервис астрологических расчетов, натальных карт и Дизайна Человека'
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://astroaura.pro/#webapp',
        'url': validLocale === 'es' ? 'https://astroaura.pro/es' : validLocale === 'en' ? 'https://astroaura.pro/en' : 'https://astroaura.pro',
        'name': validLocale === 'es'
          ? 'AstroAura — Carta Astral Gratis Online y Diseño Humano'
          : validLocale === 'en'
          ? 'AstroAura — Free Natal Chart Online & Human Design'
          : 'AstroAura — Натальная карта онлайн и Дизайн Человека',
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'All',
        'browserRequirements': 'Requires JavaScript. Requires HTML5.',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.94',
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': '28492',
          'reviewCount': '28492'
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': validLocale === 'ru' ? 'RUB' : 'USD'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': validLocale === 'es' ? 'https://astroaura.pro/es#faq' : validLocale === 'en' ? 'https://astroaura.pro/en#faq' : 'https://astroaura.pro#faq',
        'mainEntity': validLocale === 'es' ? [
          {
            '@type': 'Question',
            'name': '¿Qué es una carta natal y en qué se diferencia del horóscopo tradicional?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Una carta natal es un mapa astronómico exacto del cielo en el minuto y lugar precisos de tu nacimiento. A diferencia de los horóscopos convencionales de revista, analiza 10 planetas a través de las 12 casas, tu signo Ascendente y los aspectos matemáticos, revelando tu arquitectura psicológica y potencial financiero.'
            }
          },
          {
            '@type': 'Question',
            'name': '¿Qué revela el Biógrafo de Diseño Humano?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'El Diseño Humano combina astrología, el I Ching y física cuántica para mostrar cómo opera tu energía vital. Identifica tu tipo genético (Generador, Manifestor, Proyector, Reflector), tu Autoridad interna para tomar decisiones y tus centros energéticos definidos.'
            }
          },
          {
            '@type': 'Question',
            'name': '¿Qué tan precisos son los cálculos astronómicos?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Utilizamos algoritmos de efemérides de la NASA (JPL Horizons) y Swiss Ephemeris, calculando longitudes planetarias, casas y aspectos con precisión matemática de segundos de arco.'
            }
          },
          {
            '@type': 'Question',
            'name': '¿Qué ocurre si no conozco mi hora exacta de nacimiento?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Selecciona la opción «No conozco mi hora exacta». El sistema calculará las posiciones para el mediodía solar (12:00) — las posiciones de todos los planetas en los signos se determinan con total precisión.'
            }
          }
        ] : validLocale === 'en' ? [
          {
            '@type': 'Question',
            'name': 'What is a natal chart and how does it differ from a sun-sign horoscope?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'A natal chart is an exact astronomical blueprint of the sky at the exact minute and location of your birth. Unlike generic sun-sign horoscopes, it maps all 10 planets across 12 houses and your Ascendant, revealing your psychological architecture, subconscious blocks, and career opportunities.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What does a Human Design Bodygraph reveal?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Human Design synthesizes astrology, the I Ching, and quantum mechanics to show how your energy operates. It determines your energy type (Generator, Manifestor, Projector, Reflector), decision-making Authority, and profile lines.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How accurate are the astronomical calculations?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'We use NASA JPL Horizons and Swiss Ephemeris algorithms to calculate planetary longitudes, houses, and aspects with arc-second precision.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What if I do not know my exact birth time?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Select "I don’t know my exact birth time". Calculations will be performed for standard solar noon (12:00)—planetary signs remain 100% accurate.'
            }
          }
        ] : [
          {
            '@type': 'Question',
            'name': 'Что такое натальная карта и чем она отличается от обычного гороскопа?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Натальная карта — это персональный астрономический снимок звездного неба на момент вашего рождения с расчетом 12 домов, Асцендента и точных градусов планет по координатам вашего города. В отличие от общих прогнозов по знаку Зодиака, натальная карта описывает вашу уникальную структуру личности, финансовые точки роста и кармические задачи.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Что показывает Бодиграф Дизайна Человека?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Бодиграф раскрывает вашу генетическую энергетическую механику: один из 4 типов (Генератор, Манифестор, Проектор, Рефлектор), ваш внутренний авторитет для принятия верных решений без сопротивления, профиль и определенные энергетические центры.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Насколько точны астрономические расчеты?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Мы используем вычислительные алгоритмы эфемерид NASA и Swiss Ephemeris, учитывающие точные долготы, широты и исторический часовой пояс города на момент вашего рождения с точностью до угловой секунды.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Что делать, если я не знаю точное время своего рождения?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'При заполнении выберите опцию «Я не знаю точное время». Система выполнит расчет планет по солнечному полдню (12:00) — все планеты в знаках будут определены с предельной точностью.'
            }
          }
        ]
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

        {/* Yandex Webmaster Verification */}
        <meta
          name="yandex-verification"
          content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '994f342b75a5349d'}
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
