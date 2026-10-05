import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Crown, 
  Check, 
  UserRound, 
  MessageCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  GlassWater,
  Camera
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { studioMapsUrl, branches } from "@/lib/branches";
import { studioReviewUrl } from "@/lib/reviews";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Barber Studio Carlyn en Jacarandas | Servicios Especiales",
  description:
    "Barber Studio Carlyn en Jacarandas, Huejutla. Servicios especiales y paquetes exclusivos atendidos personalmente por Carlyn. Privacidad y atención de autor.",
  alternates: {
    canonical: "/barber-studio-jacarandas-huejutla",
  },
  openGraph: {
    title: "Barber Studio Carlyn en Jacarandas | Servicios Especiales",
    description:
      "Servicios especiales y paquetes exclusivos atendidos personalmente por Carlyn en Jacarandas, Huejutla de Reyes.",
    url: "https://www.barberiacarlyn.com/barber-studio-jacarandas-huejutla",
    siteName: "Barbería Carlyn",
    locale: "es_MX",
    type: "website",
  },
};

const eliteServices = [
  { name: "Corte de Cabello Básico", price: 150 },
  { name: "Corte de Cabello Escolar", price: 150 },
  { name: "Corte de Cabello Personalizado Premium", price: 180 },
  { name: "Corte de Cabello Básico + Arreglo de Barba", price: 250 },
  { name: "Corte de Cabello Personalizado + Arreglo de Barba", price: 280 },
  { name: "Arreglo de Barba", price: 150 },
];

const packages = [
  {
    name: "Paquete 1",
    subtitle: "Corte First Class",
    price: 250,
    desc: "La entrada al mundo Premium",
    items: ["Corte Personalizado", "Lavado de Cabello", "Peinado con Productos Premium", "Lociones al finalizar"],
  },
  {
    name: "Paquete 2",
    subtitle: "Ritual Caballero",
    price: 300,
    desc: "El favorito para el mantenimiento semanal",
    items: ["Corte Personalizado", "Arreglo de barba", "Vapor de Ozono", "Lavado de cabello", "Masaje relajante", "Peinados con productos Premium", "Loción al finalizar"],
  },
  {
    name: "Paquete 3",
    subtitle: "Premium Black",
    price: 350,
    desc: "Limpieza y Estilo",
    items: ["Corte y barba Personalizado", "Mascarilla negra", "Exfoliación facial", "Vapor Ozono", "Lavado de Cabello", "Masaje relajante, cuello, hombros", "Peinado con productos premium", "Tinte de barba"],
  },
];

const studioJsonLd = {
  "@context": "https://schema.org",
  "@type": "Barbershop",
  "@id": "https://www.barberiacarlyn.com/barber-studio-jacarandas-huejutla#studio",
  "name": "Barber Studio Carlyn VIP — Jacarandas",
  "url": "https://www.barberiacarlyn.com/barber-studio-jacarandas-huejutla",
  "telephone": "+52 771 261 3445",
  "priceRange": "$$$",
  "hasMap": studioMapsUrl,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jacarandas",
    "addressLocality": "Huejutla de Reyes",
    "addressRegion": "Hidalgo",
    "postalCode": "43000",
    "addressCountry": "MX",
  },
  "parentOrganization": {
    "@type": "Barbershop",
    "name": "Barbería Carlyn",
    "url": "https://www.barberiacarlyn.com",
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios Especiales y Paquetes VIP",
    "itemListElement": packages.map((pkg) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": `${pkg.name} - ${pkg.subtitle}`,
        "description": pkg.items.join(", "),
      },
      "price": pkg.price,
      "priceCurrency": "MXN",
    })),
  },
};

const studioFaqs = [
  {
    question: "¿Cómo se agendan los servicios en Barber Studio Jacarandas?",
    answer: "A diferencia de las sucursales generales, en Barber Studio la atención es exclusiva y con cita previa coordinada directamente por WhatsApp con Carlyn.",
  },
  {
    question: "¿Quién realiza los cortes y paquetes en esta ubicación?",
    answer: "Todos los servicios especiales son ejecutados personalmente por Carlyn, garantizando privacidad, máxima técnica y atención de autor.",
  },
  {
    question: "¿Qué beneficios exclusivos incluye la experiencia?",
    answer: "Mayor privacidad en un espacio cerrado y acondicionado, asesoramiento de imagen de alta gama, productos premium de acabado y bebida de cortesía durante tu atención.",
  },
  {
    question: "¿Dónde se encuentra ubicado Barber Studio?",
    answer: "Se encuentra ubicado en la colonia Jacarandas, C.P. 43000, en Huejutla de Reyes, Hidalgo. Consulta el mapa para la ruta exacta.",
  },
];

export default function BarberStudioJacarandasPage() {
  return (
    <div className="min-h-screen bg-brown-dark text-cream selection:bg-gold selection:text-brown-dark">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioJsonLd) }}
      />

      {/* Header fijo */}
      <header className="sticky top-0 z-40 border-b border-gold/30 bg-brown-dark/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-gold"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] text-gold uppercase tracking-[0.2em] font-semibold border border-gold/30 px-3 py-1">
              Studio Premium · Jacarandas
            </span>
            <Link href="/" aria-label="Ir a página de inicio">
              <BrandLogo className="w-28 sm:w-36" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* HERO SECTION DE AUTOR */}
        <section aria-labelledby="studio-hero-title" className="relative">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center text-center lg:text-left">
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 border border-gold/40 bg-gold/15 px-4 py-1.5 text-xs text-gold font-bold uppercase tracking-widest mb-6 retro-glow">
                <Crown className="w-4 h-4 text-gold" aria-hidden="true" />
                <span>Ubicación Especializada · Jacarandas, Huejutla</span>
              </div>

              <h1
                id="studio-hero-title"
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream max-w-4xl leading-tight"
              >
                Barber Studio Carlyn en <span className="text-gradient-gold">Jacarandas</span>
              </h1>

              <p className="text-gold font-serif text-lg sm:text-2xl max-w-2xl mt-4">
                Servicios especiales realizados personalmente por Carlyn.
              </p>

              <p className="text-cream/70 max-w-2xl mt-4 text-sm sm:text-base leading-relaxed">
                Una experiencia diseñada para quienes buscan exclusividad, privacidad absoluta y el más alto nivel de técnica. Disfruta de una bebida de cortesía durante tu servicio.
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
                <a
                  href={studioMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cómo llegar a Barber Studio Carlyn Jacarandas en Google Maps (abrir en nueva pestaña)"
                  className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-gold text-brown-dark font-bold text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-md hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                >
                  <MapPin className="w-4 h-4 shrink-0 text-brown-dark" aria-hidden="true" />
                  <span>CÓMO LLEGAR</span>
                </a>

                <a
                  href={studioReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver y calificar reseñas de Barber Studio Carlyn Jacarandas en Google Maps (abrir en nueva pestaña)"
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-gold/40 text-gold text-xs tracking-wider uppercase font-semibold inline-flex items-center justify-center gap-2 hover:bg-gold/10 hover:border-gold/60 hover:text-cream active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                >
                  <Star className="w-3.5 h-3.5 shrink-0 text-gold fill-gold/20" aria-hidden="true" />
                  <span>VER RESEÑAS</span>
                </a>

                <a
                  href={whatsappLink("Hola Carlyn, deseo agendar una cita en BARBER STUDIO CARLYN Jacarandas.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Agendar con Carlyn por WhatsApp"
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#25D366] text-brown-dark text-xs tracking-wider uppercase font-bold inline-flex items-center justify-center gap-2 hover:bg-[#20ba59] active:scale-[0.99] transition-all duration-300"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0 text-brown-dark" aria-hidden="true" />
                  <span>CONSULTAR / AGENDAR</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none">
              <div className="relative border border-gold/40 bg-brown-medium/40 p-2 sm:p-2.5 retro-glow group">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-brown-dark/80">
                  <Image
                    src="/images/sucursales/jacarandas/Jacarandas.png"
                    alt="Sesión exclusiva de cuidado de barba con vapor de ozono en Barber Studio Carlyn Jacarandas"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/85 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-brown-dark/90 text-gold border border-gold/40 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm">
                      Ritual con Vapor de Ozono
                    </span>
                    <span className="text-cream/90 text-[11px] font-medium bg-brown-dark/70 px-2 py-0.5 border border-gold/20">
                      Jacarandas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PILARES VIP */}
        <section aria-labelledby="vip-pillars" className="grid sm:grid-cols-3 gap-5">
          <div className="border border-gold/30 bg-brown-medium/30 p-6 retro-glow">
            <ShieldCheck className="w-7 h-7 text-gold mb-3" aria-hidden="true" />
            <h3 className="font-serif text-lg font-bold text-cream mb-1">Mayor Privacidad</h3>
            <p className="text-cream/60 text-xs leading-relaxed">
              Ambiente cerrado e íntimo pensado para empresarios y caballeros que valoran su tiempo y confidencialidad.
            </p>
          </div>
          <div className="border border-gold/30 bg-brown-medium/30 p-6 retro-glow">
            <UserRound className="w-7 h-7 text-gold mb-3" aria-hidden="true" />
            <h3 className="font-serif text-lg font-bold text-cream mb-1">Atención por Carlyn</h3>
            <p className="text-cream/60 text-xs leading-relaxed">
              Servicios realizados de principio a fin de manera personalizada por el fundador con las técnicas más avanzadas.
            </p>
          </div>
          <div className="border border-gold/30 bg-brown-medium/30 p-6 retro-glow">
            <GlassWater className="w-7 h-7 text-gold mb-3" aria-hidden="true" />
            <h3 className="font-serif text-lg font-bold text-cream mb-1">Bebida de Cortesía</h3>
            <p className="text-cream/60 text-xs leading-relaxed">
              Disfruta de una bebida selecta de cortesía para acompañar tu sesión de corte o ritual de spa facial.
            </p>
          </div>
        </section>

        {/* GALERÍA DE ESPACIO Y EXPERIENCIA PREMIUM */}
        <section aria-labelledby="studio-gallery-title" className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.3em] uppercase mb-2">
              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Fotos Reales del Studio Premium</span>
            </div>
            <h2 id="studio-gallery-title" className="font-serif text-3xl sm:text-4xl text-cream">
              Espacio y Experiencia en <span className="text-gradient-gold">Jacarandas</span>
            </h2>
            <p className="text-cream/60 text-xs sm:text-sm max-w-xl mx-auto mt-2">
              Privacidad absoluta, atención especializada y rituales diseñados para tu confort.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <figure className="border border-gold/30 bg-brown-medium/30 p-3 overflow-hidden group hover:border-gold/50 transition-all duration-300 retro-glow flex flex-col justify-between">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brown-dark/60">
                <Image
                  src="/images/sucursales/jacarandas/Jacarandas.png"
                  alt="Tratamiento facial y ritual de toalla caliente con vapor de ozono en cabina de Barber Studio Carlyn"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 bg-brown-dark/90 text-gold border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                  Ritual Premium
                </span>
              </div>
              <figcaption className="p-3 text-left">
                <p className="font-serif text-base font-semibold text-cream group-hover:text-gold transition-colors">
                  Ritual Caballero & Vapor de Ozono
                </p>
                <p className="text-cream/60 text-xs mt-1 leading-snug">
                  Tratamiento facial y cuidado de barba de alta gama con equipo profesional de vapor de ozono en cabina privada.
                </p>
              </figcaption>
            </figure>

            <figure className="border border-gold/30 bg-brown-medium/30 p-3 overflow-hidden group hover:border-gold/50 transition-all duration-300 retro-glow flex flex-col justify-between">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brown-dark/60">
                <Image
                  src="/images/sucursales/jacarandas/Jacarandas.jpeg"
                  alt="Entorno residencial y ubicación de Barber Studio Carlyn premiun en la colonia Jacarandas, Huejutla"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 bg-brown-dark/90 text-gold border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                  Ubicación Premium
                </span>
              </div>
              <figcaption className="p-3 text-left">
                <p className="font-serif text-base font-semibold text-cream group-hover:text-gold transition-colors">
                  Ubicación y Privacidad en Jacarandas
                </p>
                <p className="text-cream/60 text-xs mt-1 leading-snug">
                  Entorno residencial exclusivo y privado para atención con cita previa en Huejutla de Reyes.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* PAQUETES EXCLUSIVOS */}
        <section aria-labelledby="packages-title">
          <div className="text-center mb-10">
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Rituales Completos</span>
            <h2 id="packages-title" className="font-serif text-3xl sm:text-4xl text-cream mt-2">
              Nuestros <span className="text-gradient-gold">Paquetes Premium</span>
            </h2>
            <p className="text-cream/60 text-sm max-w-xl mx-auto mt-2">
              Experiencias integrales de corte, cuidado de barba y tratamiento facial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className="border border-gold/40 bg-gradient-to-b from-brown-medium/50 to-brown-dark p-6 sm:p-8 flex flex-col justify-between retro-glow"
              >
                <div>
                  <div className="mb-4">
                    <span className="text-xs uppercase text-gold/80 tracking-widest font-semibold">{pkg.subtitle}</span>
                    <h3 className="font-serif text-2xl font-bold text-cream mt-1">{pkg.name}</h3>
                    <p className="text-cream/60 text-xs mt-1">{pkg.desc}</p>
                  </div>

                  <p className="text-gold font-serif text-3xl font-bold mb-6">
                    ${pkg.price} <span className="text-xs font-sans text-cream/50">MXN</span>
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {pkg.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-cream/80 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={whatsappLink(`Hola Carlyn, deseo agendar el ${pkg.name} (${pkg.subtitle}) de $${pkg.price} MXN en Barber Studio Jacarandas.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gold text-brown-dark font-bold text-xs uppercase tracking-wider text-center inline-flex items-center justify-center gap-2 hover:bg-gold-light transition-colors"
                >
                  <span>Agendar {pkg.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* SERVICIOS INDIVIDUALES ELITE */}
        <section aria-labelledby="elite-services-title">
          <div className="text-center mb-8">
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Carta de Servicios</span>
            <h2 id="elite-services-title" className="font-serif text-3xl sm:text-4xl text-cream mt-2">
              Servicios <span className="text-gold">Elite Premium</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eliteServices.map((svc) => (
              <div
                key={svc.name}
                className="border border-gold/25 bg-brown-medium/20 p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-serif text-base font-semibold text-cream">{svc.name}</h3>
                  <p className="text-gold text-xs mt-1">Atención por Carlyn</p>
                </div>
                <span className="font-serif text-xl font-bold text-gold">${svc.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* UBICACIÓN Y RESEÑAS */}
        <section
          aria-labelledby="studio-nap-title"
          className="border border-gold/30 bg-brown-medium/30 p-7 sm:p-10 text-center"
        >
          <MapPin className="w-8 h-8 text-gold mx-auto mb-4" aria-hidden="true" />
          <h2 id="studio-nap-title" className="font-serif text-2xl sm:text-3xl text-cream mb-2">
            Ubicación en Jacarandas
          </h2>
          <p className="text-cream/70 max-w-xl mx-auto text-sm leading-relaxed mb-6">
            Colonia Jacarandas, 43000 Huejutla de Reyes, Hgo. Consulta la ruta en Google Maps y evalúa tu experiencia tras visitarnos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={studioMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-gold text-brown-dark font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-gold-light transition-colors"
            >
              <span>Ver en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href={studioReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 border border-gold/30 text-gold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors"
            >
              <span>Calificar en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* FAQ STUDIO */}
        <section aria-labelledby="studio-faq-title">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.3em] uppercase">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>Preguntas Frecuentes</span>
            </div>
            <h2 id="studio-faq-title" className="font-serif text-3xl sm:text-4xl text-cream mt-2">
              Dudas sobre Barber Studio Carlyn Premium
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {studioFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gold/25 bg-brown-medium/20 p-6"
              >
                <h3 className="font-serif text-base sm:text-lg font-bold text-gold mb-2 flex items-start gap-2">
                  <span className="text-cream/40 text-xs mt-1">0{idx + 1}.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-cream/70 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SUCURSALES GENERALES */}
        <section aria-labelledby="general-branches-title" className="border-t border-gold/20 pt-12">
          <div className="text-center mb-8">
            <h2 id="general-branches-title" className="font-serif text-2xl sm:text-3xl text-cream">
              ¿Buscas atención rápida sin cita previa?
            </h2>
            <p className="text-cream/60 text-xs sm:text-sm mt-1">
              Conoce nuestras tres sucursales generales en Huejutla de Reyes.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {branches.map((b) => (
              <Link
                key={b.id}
                href={`/barberia-huejutla-${b.id}`}
                className="group border border-gold/20 bg-brown-medium/20 p-5 hover:border-gold/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-base font-bold text-cream group-hover:text-gold transition-colors">
                    {b.name}
                  </h3>
                  <p className="text-cream/60 text-xs mt-2 line-clamp-2">{b.address}</p>
                  <p className="text-gold/70 text-xs mt-2">Barbero: {b.barber}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-xs text-gold">
                  <span>Ver detalles de esta sucursal</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-gold/15 bg-brown-dark mt-16 py-8 text-center text-xs text-cream/40">
        <p>&copy; {new Date().getFullYear()} Barber Studio Carlyn Premium. Huejutla de Reyes, Hidalgo.</p>
        <p className="mt-1">
          <Link href="/" className="text-gold hover:underline">Inicio</Link> · 
          <a href={studioMapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline ml-2">Google Maps</a>
        </p>
      </footer>

      {/* ChatWeb Integration */}
      <Script
        src="https://digita3-ai.vercel.app/widget.js"
        data-agent="barberia-carlyn"
        strategy="afterInteractive"
      />
    </div>
  );
}
