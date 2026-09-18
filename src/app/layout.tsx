import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AstroAura — Натальная карта онлайн, Совместимость и Дизайн Человека",
  description: "Точный расчет натальной карты, гороскопа совместимости и бодиграфа Дизайна Человека на основе эфемерид NASA и Swiss Ephemeris. Узнайте свой кармический код и вектор реализации.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
