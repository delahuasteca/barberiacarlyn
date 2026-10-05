import type { Metadata } from "next";
import BranchLanding from "@/components/BranchLanding";

export const metadata: Metadata = {
  title: "Barbería en Aviación Civil Huejutla | Barbería Carlyn",
  description:
    "Visita Barbería Carlyn en Aviación Civil, Huejutla de Reyes. Cortes de cabello, fades y arreglo de barba atendido por Jael. Sin cita previa. Consulta cómo llegar.",
  alternates: {
    canonical: "/barberia-huejutla-aviacion-civil",
  },
  openGraph: {
    title: "Barbería en Aviación Civil Huejutla | Barbería Carlyn",
    description:
      "Visita Barbería Carlyn en Aviación Civil, Huejutla de Reyes. Cortes de cabello, fades y arreglo de barba atendido por Jael. Sin cita previa.",
    url: "https://www.barberiacarlyn.com/barberia-huejutla-aviacion-civil",
    siteName: "Barbería Carlyn",
    locale: "es_MX",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Barbershop",
  "@id": "https://www.barberiacarlyn.com/barberia-huejutla-aviacion-civil#branch",
  "name": "Barbería Carlyn — Sucursal Aviación Civil",
  "url": "https://www.barberiacarlyn.com/barberia-huejutla-aviacion-civil",
  "telephone": "+52 771 261 3445",
  "priceRange": "$$",
  "hasMap": "https://maps.app.goo.gl/eFiFQdVjH1j1cmr86",
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
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:00",
    },
  ],
  "parentOrganization": {
    "@type": "Barbershop",
    "name": "Barbería Carlyn",
    "url": "https://www.barberiacarlyn.com",
  },
};

const faqs = [
  {
    question: "¿Necesito cita para atenderme en la sucursal Aviación Civil?",
    answer: "No, en esta sucursal la atención es directa por orden de llegada, sin necesidad de cita previa.",
  },
  {
    question: "¿Quién atiende en la sucursal Aviación Civil?",
    answer: "La atención está a cargo de nuestro barbero profesional Jael, especialista en cortes modernos, clásicos y arreglo de barba.",
  },
  {
    question: "¿Cuáles son los horarios de atención?",
    answer: "Abierto de lunes a sábado de 9:00 AM a 8:00 PM. Los domingos permanece cerrado.",
  },
  {
    question: "¿Dónde está ubicada exactamente la sucursal Aviación Civil?",
    answer: "Se ubica en Adolfo López Mateos 33, colonia Aviación Civil, C.P. 43000, en Huejutla de Reyes, Hidalgo.",
  },
];

export default function AviacionCivilPage() {
  return (
    <BranchLanding
      branchId="aviacion-civil"
      neighborhood="Aviación Civil"
      heroTagline="Estilo, precisión y tradición cerca de ti en la colonia Aviación Civil."
      description="Tu barbería de confianza en la zona de Aviación Civil. Cortes impecables, fades a medida y delineado de barba con el estándar de calidad Carlyn."
      faqs={faqs}
      jsonLd={jsonLd}
    />
  );
}
