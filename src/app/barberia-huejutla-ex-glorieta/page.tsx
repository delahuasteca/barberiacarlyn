import type { Metadata } from "next";
import BranchLanding from "@/components/BranchLanding";

export const metadata: Metadata = {
  title: "Barbería en Santa Irene Huejutla | Barbería Carlyn Ex-Glorieta",
  description:
    "Barbería Carlyn en Ex-Glorieta / Santa Irene, Huejutla. Cortes de cabello y arreglo de barba atendido por Johan y Chucky Barber. Jueves a martes sin cita previa.",
  alternates: {
    canonical: "/barberia-huejutla-ex-glorieta",
  },
  openGraph: {
    title: "Barbería en Santa Irene Huejutla | Barbería Carlyn Ex-Glorieta",
    description:
      "Barbería Carlyn en Ex-Glorieta / Santa Irene, Huejutla. Cortes de cabello y arreglo de barba atendido por Johan y Chucky Barber. Jueves a martes sin cita previa.",
    url: "https://www.barberiacarlyn.com/barberia-huejutla-ex-glorieta",
    siteName: "Barbería Carlyn",
    locale: "es_MX",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Barbershop",
  "@id": "https://www.barberiacarlyn.com/barberia-huejutla-ex-glorieta#branch",
  "name": "Barbería Carlyn — Sucursal Ex-Glorieta",
  "url": "https://www.barberiacarlyn.com/barberia-huejutla-ex-glorieta",
  "telephone": "+52 771 261 3445",
  "priceRange": "$$",
  "hasMap": "https://maps.app.goo.gl/gXseXXVcrJTq7D7d8",
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
  "parentOrganization": {
    "@type": "Barbershop",
    "name": "Barbería Carlyn",
    "url": "https://www.barberiacarlyn.com",
  },
};

const faqs = [
  {
    question: "¿Dónde se encuentra la sucursal Ex-Glorieta?",
    answer: "Está ubicada sobre la Carretera Nacional México-Tampico Km 215 4, en la colonia Santa Irene, C.P. 43000, Huejutla de Reyes.",
  },
  {
    question: "¿Quién atiende en la sucursal Ex-Glorieta?",
    answer: "La atención está a cargo de Johan y Chucky Barber, con servicio profesional y especializado en estilos modernos y afeitados.",
  },
  {
    question: "¿Qué días y horarios abre esta sucursal?",
    answer: "Abre de jueves a martes en horario de 9:00 AM a 8:00 PM. Los miércoles permanece cerrado por descanso semanal.",
  },
  {
    question: "¿Se debe reservar turno para corte o barba?",
    answer: "No es necesario reservar. Te atendemos por orden de llegada con rapidez y la mejor atención.",
  },
];

const branchPhotos = [
  {
    src: "/images/sucursales/ex-glorieta/Barbero-Johan.jpeg",
    alt: "Johan, barbero de Barbería Carlyn sucursal Ex-Glorieta",
    title: "Johan — Barbero Oficial",
    badge: "Barbero",
  },
  {
    src: "/images/sucursales/ex-glorieta/ExGlorieta.png",
    alt: "Estación de corte y área de trabajo interior en Barbería Carlyn sucursal Ex-Glorieta",
    title: "Estación de Trabajo e Interior",
    badge: "Instalaciones",
  },
  {
    src: "/images/sucursales/ex-glorieta/ExGlorieta_1.png",
    alt: "Detalle del acceso y puerta de entrada en Barbería Carlyn sucursal Ex-Glorieta",
    title: "Acceso y Entrada al Local",
    badge: "Acceso",
  },
  {
    src: "/images/sucursales/ex-glorieta/Chucky_barber.jpeg",
    alt: "Chucky Barber, barbero de Barbería Carlyn sucursal Ex-Glorieta",
    title: "Chucky Barber — Barbero Oficial",
    badge: "Barbero",
  },
];

const heroPhoto = {
  src: "/images/sucursales/ex-glorieta/ExGlorieta.jpeg",
  alt: "Fachada principal de Barbería Carlyn con poste de barbero tradicional en Ex-Glorieta, Santa Irene",
  title: "Fachada Oficial Ex-Glorieta",
  badge: "Fachada Oficial",
};

export default function ExGlorietaPage() {
  return (
    <BranchLanding
      branchId="ex-glorieta"
      neighborhood="Ex-Glorieta / Santa Irene"
      heroTagline="Ubicación estratégica sobre la México-Tampico para tu corte y estilo semanal."
      description="Visita nuestra sucursal en Ex-Glorieta. Fácil acceso, ambiente cómodo y la dedicación de Johan y Chucky Barber para cuidar tu imagen con el sello de Carlyn."
      faqs={faqs}
      jsonLd={jsonLd}
      heroImage={heroPhoto}
      gallery={branchPhotos}
    />
  );
}
