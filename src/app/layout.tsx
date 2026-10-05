import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.barberiacarlyn.com"),
  title: "Barbería en Huejutla | Cortes, Barba y Fades | Barbería Carlyn",
  description:
    "Barbería Carlyn en Huejutla de Reyes, Hidalgo. Cortes de cabello, fades, arreglo de barba y servicio profesional. Encuentra tu sucursal más cercana y consulta cómo llegar.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "barbería en Huejutla",
    "barbero en Huejutla",
    "corte de cabello en Huejutla",
    "fade en Huejutla",
    "arreglo de barba Huejutla",
    "barbería Huejutla de Reyes",
    "Barbería Carlyn",
    "barbería cerca de mí Huejutla",
    "cortes de cabello para hombre Huejutla",
  ],
  openGraph: {
    title: "Barbería en Huejutla | Cortes, Barba y Fades | Barbería Carlyn",
    description:
      "Barbería Carlyn en Huejutla de Reyes, Hidalgo. Cortes de cabello, fades, arreglo de barba y servicio profesional. Encuentra tu sucursal más cercana y consulta cómo llegar.",
    url: "https://www.barberiacarlyn.com/",
    siteName: "Barbería Carlyn",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/images/carlyn-sucursales-hero.png",
        width: 1200,
        height: 630,
        alt: "Barbería Carlyn en Huejutla de Reyes - Sucursales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barbería en Huejutla | Cortes, Barba y Fades | Barbería Carlyn",
    description:
      "Barbería Carlyn en Huejutla de Reyes, Hidalgo. Cortes de cabello, fades, arreglo de barba y servicio profesional.",
    images: ["/images/carlyn-sucursales-hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Barbershop",
      "@id": "https://www.barberiacarlyn.com/#organization",
      "name": "Barbería Carlyn",
      "url": "https://www.barberiacarlyn.com",
      "logo": "https://www.barberiacarlyn.com/logo-rojo-carlyn.png",
      "image": "https://www.barberiacarlyn.com/images/carlyn-sucursales-hero.png",
      "telephone": "+52 771 261 3445",
      "priceRange": "$$",
      "sameAs": [
        "https://www.instagram.com/carlyn_barberia/",
        "https://www.facebook.com/CarlynBarberiaVip/",
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Adolfo López Mateos 33, Aviación Civil",
        "addressLocality": "Huejutla de Reyes",
        "addressRegion": "Hidalgo",
        "postalCode": "43000",
        "addressCountry": "MX",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.1408,
        "longitude": -98.4194,
      },
    },
    {
      "@type": "Barbershop",
      "@id": "https://www.barberiacarlyn.com/#branch-aviacion-civil",
      "name": "Barbería Carlyn — Sucursal Aviación Civil",
      "parentOrganization": {
        "@id": "https://www.barberiacarlyn.com/#organization",
      },
      "url": "https://www.barberiacarlyn.com/#branches",
      "hasMap": "https://maps.app.goo.gl/eFiFQdVjH1j1cmr86",
      "telephone": "+52 771 261 3445",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Adolfo López Mateos 33, Aviación Civil",
        "addressLocality": "Huejutla de Reyes",
        "addressRegion": "Hidalgo",
        "postalCode": "43000",
        "addressCountry": "MX",
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "20:00",
        },
      ],
    },
    {
      "@type": "Barbershop",
      "@id": "https://www.barberiacarlyn.com/#branch-ex-glorieta",
      "name": "Barbería Carlyn — Sucursal Ex-Glorieta",
      "parentOrganization": {
        "@id": "https://www.barberiacarlyn.com/#organization",
      },
      "url": "https://www.barberiacarlyn.com/#branches",
      "hasMap": "https://maps.app.goo.gl/gXseXXVcrJTq7D7d8",
      "telephone": "+52 771 261 3445",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Carretera Nacional México-Tampico Km 215 4, Santa Irene",
        "addressLocality": "Huejutla de Reyes",
        "addressRegion": "Hidalgo",
        "postalCode": "43000",
        "addressCountry": "MX",
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"],
          "opens": "09:00",
          "closes": "20:00",
        },
      ],
    },
    {
      "@type": "Barbershop",
      "@id": "https://www.barberiacarlyn.com/#branch-tecoluco",
      "name": "Barbería Carlyn — Sucursal Tecoluco",
      "parentOrganization": {
        "@id": "https://www.barberiacarlyn.com/#organization",
      },
      "url": "https://www.barberiacarlyn.com/#branches",
      "hasMap": "https://maps.app.goo.gl/71zFemsin8cXQpyX9",
      "telephone": "+52 771 261 3445",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Huejutla Tamazunchale 5 de Mayo",
        "addressLocality": "Huejutla de Reyes",
        "addressRegion": "Hidalgo",
        "postalCode": "43000",
        "addressCountry": "MX",
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "20:00",
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${lato.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col noise-overlay">{children}</body>
    </html>
  );
}
