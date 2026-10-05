import type { Metadata } from "next";
import BranchLanding from "@/components/BranchLanding";

export const metadata: Metadata = {
  title: "Barbería en Tecoluco Huejutla | Barbería Carlyn",
  description:
    "Barbería Carlyn en Tecoluco, Huejutla de Reyes. Cortes de cabello, fades y barba profesional atendido por Johan. Lunes a sábado 9am a 8pm sin cita previa.",
  alternates: {
    canonical: "/barberia-huejutla-tecoluco",
  },
  openGraph: {
    title: "Barbería en Tecoluco Huejutla | Barbería Carlyn",
    description:
      "Barbería Carlyn en Tecoluco, Huejutla de Reyes. Cortes de cabello, fades y barba profesional atendido por Johan. Lunes a sábado sin cita previa.",
    url: "https://www.barberiacarlyn.com/barberia-huejutla-tecoluco",
    siteName: "Barbería Carlyn",
    locale: "es_MX",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Barbershop",
  "@id": "https://www.barberiacarlyn.com/barberia-huejutla-tecoluco#branch",
  "name": "Barbería Carlyn — Sucursal Tecoluco",
  "url": "https://www.barberiacarlyn.com/barberia-huejutla-tecoluco",
  "telephone": "+52 771 261 3445",
  "priceRange": "$$",
  "hasMap": "https://maps.app.goo.gl/71zFemsin8cXQpyX9",
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
  "parentOrganization": {
    "@type": "Barbershop",
    "name": "Barbería Carlyn",
    "url": "https://www.barberiacarlyn.com",
  },
};

const faqs = [
  {
    question: "¿Dónde se ubica la sucursal Tecoluco?",
    answer: "Se encuentra sobre la calle 5 de Mayo (tramo Huejutla - Tamazunchale), C.P. 43000, en Huejutla de Reyes, Hidalgo.",
  },
  {
    question: "¿Quién atiende en la sucursal Tecoluco?",
    answer: "El servicio y atención están a cargo de nuestro barbero Johan, con atención cuidada en cada corte y diseño de barba.",
  },
  {
    question: "¿Cuáles son los días y horarios de apertura?",
    answer: "Abrimos de lunes a sábado de 9:00 AM a 8:00 PM. Los domingos se encuentra cerrado.",
  },
  {
    question: "¿Hay que agendar turno con anticipación?",
    answer: "No, atendemos por orden de llegada para que puedas acudir en el horario que más te convenga.",
  },
];

const branchPhotos = [
  {
    src: "/images/sucursales/tecoluco/Tecoluco2.png",
    alt: "Vista frontal exterior y cristalería de Barbería Carlyn sucursal Tecoluco en Huejutla",
    title: "Fachada y Cristalería Exterior",
    badge: "Fachada",
  },
  {
    src: "/images/sucursales/tecoluco/Tecoluco.png",
    alt: "Estación de corte con espejo iluminado y sillón de barbero en Barbería Carlyn Tecoluco",
    title: "Estación de Corte y Espejo Iluminado",
    badge: "Instalaciones",
  },
  {
    src: "/images/sucursales/tecoluco/Tecoluco1.png",
    alt: "Sala de espera y perspectiva general interior de Barbería Carlyn sucursal Tecoluco",
    title: "Sala de Espera e Interior",
    badge: "Área de Espera",
  },
  {
    src: "/images/sucursales/tecoluco/Tecoluco.jpeg",
    alt: "Fachada vertical de Barbería Carlyn sobre calle 5 de Mayo en la colonia Tecoluco",
    title: "Vista Exterior y Calle",
    badge: "Ubicación",
  },
];

const heroPhoto = {
  src: "/images/sucursales/tecoluco/Tecoluco2.png",
  alt: "Fachada exterior con ventanales y letrero comercial de Barbería Carlyn sucursal Tecoluco",
  title: "Fachada Oficial Tecoluco",
  badge: "Fachada Oficial",
};

export default function TecolucoPage() {
  return (
    <BranchLanding
      branchId="tecoluco"
      neighborhood="Tecoluco"
      heroTagline="Cortes nítidos, atención cercana y el mejor ambiente en la zona de Tecoluco."
      description="Tu parada de estilo en Tecoluco. Disfruta del servicio personalizado de Johan con acabados profesionales para el caballero moderno."
      faqs={faqs}
      jsonLd={jsonLd}
      heroImage={heroPhoto}
      gallery={branchPhotos}
    />
  );
}
