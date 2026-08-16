import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sukhoi.example"),
  title: "ОКБ Сухого — создаём небо с 1939 года",
  description:
    "АО «Сухой» — часть ОАК. Более 85 лет создаём крылья, которые защищают и соединяют: Су-27, Су-35С, Су-57, Су-34 и Sukhoi Superjet 100.",
  keywords: [
    "ОКБ Сухого",
    "Сухой",
    "Су-57",
    "Су-35",
    "Су-34",
    "Су-27",
    "SSJ-100",
    "ОАК",
    "авиация",
  ],
  authors: [{ name: "АО «Сухой»" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "ОКБ Сухого — создаём небо с 1939 года",
    description:
      "Легендарные «сушки», технологии 5-го поколения и карьера в конструкторском бюро.",
    siteName: "ОКБ Сухого",
  },
  twitter: {
    card: "summary_large_image",
    title: "ОКБ Сухого — создаём небо с 1939 года",
    description:
      "Легендарные «сушки», технологии 5-го поколения и карьера в конструкторском бюро.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Russo+One&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
