import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  UserRound, 
  CalendarX, 
  Phone, 
  Star, 
  Scissors, 
  Crown, 
  Flame, 
  Slice, 
  MessageCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Camera
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { branches, branchMapsLink } from "@/lib/branches";
import { branchReviews } from "@/lib/reviews";
import { whatsappLink } from "@/lib/whatsapp";

export interface BranchPhoto {
  src: string;
  alt: string;
  title: string;
  badge?: string;
}

interface BranchLandingProps {
  branchId: "aviacion-civil" | "ex-glorieta";
  neighborhood: string;
  heroTagline: string;
  description: string;
  faqs: { question: string; answer: string }[];
  jsonLd: Record<string, unknown>;
  heroImage?: BranchPhoto;
  gallery?: BranchPhoto[];
}

const standardServices = [
  { icon: Scissors, name: "Corte de Cabello Básico", price: "$100", desc: "Corte clásico con máquina y tijera, acabado limpio." },
  { icon: Star, name: "Corte de Cabello Escolar", price: "$100", desc: "Estilo formal y prolijo adaptado a normativas escolares." },
  { icon: Crown, name: "Corte Personalizado", price: "$120", desc: "Fades, degradados precisos, taper y estilos en tendencia." },
  { icon: Flame, name: "Corte + Arreglo de Barba", price: "$150", desc: "Servicio completo: corte de cabello y perfilado de barba." },
  { icon: Scissors, name: "Arreglo de Barba", price: "$100", desc: "Delineado, rebaje y cuidado facial de barba." },
  { icon: Slice, name: "Arreglo de Cejas", price: "$30", desc: "Perfilado y limpieza con navaja y tijera." },
];

export default function BranchLanding({
  branchId,
  neighborhood,
  heroTagline,
  description,
  faqs,
  jsonLd,
  heroImage,
  gallery,
}: BranchLandingProps) {
  const branch = branches.find((b) => b.id === branchId)!;
  const reviewInfo = branchReviews[branchId];
  const reviewsUrl = reviewInfo?.writeUrl || branchMapsLink(branch);
  const otherBranches = branches.filter((b) => b.id !== branchId);

  return (
    <div className="min-h-screen bg-brown-dark text-cream selection:bg-gold selection:text-brown-dark">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header fijo */}
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-brown-dark/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-gold"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver al inicio</span>
          </Link>
          <Link href="/" aria-label="Ir a página de inicio">
            <BrandLogo className="w-28 sm:w-36" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* HERO SECTION */}
        <section aria-labelledby="branch-hero-title" className="relative">
          {heroImage ? (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center text-center lg:text-left">
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
                <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-gold font-medium uppercase tracking-widest mb-6">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sucursal {neighborhood} · Huejutla de Reyes</span>
                </div>

                <h1
                  id="branch-hero-title"
                  className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream max-w-4xl leading-tight"
                >
                  {branch.name}
                </h1>

                <p className="text-gold font-serif text-lg sm:text-xl max-w-2xl mt-4">
                  {heroTagline}
                </p>

                <p className="text-cream/70 max-w-2xl mt-4 text-sm sm:text-base leading-relaxed">
                  {description}
                </p>

                {/* ACTION BUTTONS */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
                  <a
                    href={branchMapsLink(branch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Cómo llegar a ${branch.name} en Google Maps (abrir en nueva pestaña)`}
                    className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-gold text-brown-dark font-bold text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-md hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-brown-dark" aria-hidden="true" />
                    <span>CÓMO LLEGAR</span>
                  </a>

                  <a
                    href={reviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver y calificar reseñas de ${branch.name} en Google Maps (abrir en nueva pestaña)`}
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-gold/40 text-gold text-xs tracking-wider uppercase font-semibold inline-flex items-center justify-center gap-2 hover:bg-gold/10 hover:border-gold/60 hover:text-cream active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                  >
                    <Star className="w-3.5 h-3.5 shrink-0 text-gold fill-gold/20" aria-hidden="true" />
                    <span>VER RESEÑAS</span>
                  </a>

                  <a
                    href={whatsappLink(`Hola, quisiera consultar información sobre la ${branch.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Escribir por WhatsApp a Barbería Carlyn"
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-[#25D366]/40 text-[#25D366] text-xs tracking-wider uppercase font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#25D366]/10 hover:border-[#25D366] transition-all duration-300"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>WHATSAPP</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none">
                <div className="relative border border-gold/30 bg-brown-medium/40 p-2 sm:p-2.5 retro-glow group">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-brown-dark/80">
                    <Image
                      src={heroImage.src}
                      alt={heroImage.alt}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/85 via-transparent to-transparent opacity-60" />
                    {heroImage.badge && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="bg-brown-dark/90 text-gold border border-gold/40 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm">
                          {heroImage.badge}
                        </span>
                        <span className="text-cream/90 text-[11px] font-medium bg-brown-dark/70 px-2 py-0.5 border border-gold/20">
                          {neighborhood}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-gold font-medium uppercase tracking-widest mb-6">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sucursal {neighborhood} · Huejutla de Reyes</span>
              </div>

              <h1
                id="branch-hero-title"
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream max-w-4xl mx-auto leading-tight"
              >
                {branch.name}
              </h1>

              <p className="text-gold font-serif text-lg sm:text-xl max-w-2xl mx-auto mt-4">
                {heroTagline}
              </p>

              <p className="text-cream/70 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
                {description}
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <a
                  href={branchMapsLink(branch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Cómo llegar a ${branch.name} en Google Maps (abrir en nueva pestaña)`}
                  className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-gold text-brown-dark font-bold text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-md hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                >
                  <MapPin className="w-4 h-4 shrink-0 text-brown-dark" aria-hidden="true" />
                  <span>CÓMO LLEGAR</span>
                </a>

                <a
                  href={reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver y calificar reseñas de ${branch.name} en Google Maps (abrir en nueva pestaña)`}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-gold/40 text-gold text-xs tracking-wider uppercase font-semibold inline-flex items-center justify-center gap-2 hover:bg-gold/10 hover:border-gold/60 hover:text-cream active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                >
                  <Star className="w-3.5 h-3.5 shrink-0 text-gold fill-gold/20" aria-hidden="true" />
                  <span>VER RESEÑAS</span>
                </a>

                <a
                  href={whatsappLink(`Hola, quisiera consultar información sobre la ${branch.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Escribir por WhatsApp a Barbería Carlyn"
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-[#25D366]/40 text-[#25D366] text-xs tracking-wider uppercase font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#25D366]/10 hover:border-[#25D366] transition-all duration-300"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>
          )}
        </section>

        {/* FICHA TÉCNICA LOCAL / NAP */}
        <section
          aria-labelledby="nap-title"
          className="border border-gold/30 bg-brown-medium/40 p-6 sm:p-10 retro-glow"
        >
          <h2 id="nap-title" className="font-serif text-2xl sm:text-3xl text-cream mb-6 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-gold" aria-hidden="true" />
            <span>Información de la Sucursal</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase text-gold/70 tracking-wider font-semibold">Dirección</span>
              <p className="text-cream text-sm leading-relaxed">{branch.address}</p>
              <p className="text-cream/50 text-xs mt-1">Huejutla de Reyes, Hidalgo</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase text-gold/70 tracking-wider font-semibold">Horario</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <p className="text-cream text-sm">{branch.hours}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase text-gold/70 tracking-wider font-semibold">Atención</span>
              <div className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <p className="text-cream text-sm">
                  Barbero: <strong className="text-gold">{branch.barber}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2 text-cream/70 text-xs mt-1">
                <CalendarX className="w-3.5 h-3.5 text-gold/60 shrink-0" aria-hidden="true" />
                <span>Sin cita previa · Orden de llegada</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase text-gold/70 tracking-wider font-semibold">Teléfono</span>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <a
                  href="tel:+527712613445"
                  className="text-cream text-sm hover:text-gold transition-colors"
                >
                  +52 771 261 3445
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* GALERÍA DE FOTOS REALES DE LA SUCURSAL */}
        {gallery && gallery.length > 0 && (
          <section aria-labelledby="gallery-title" className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.3em] uppercase mb-2">
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Instalaciones y Fotos Reales</span>
              </div>
              <h2 id="gallery-title" className="font-serif text-3xl sm:text-4xl text-cream">
                Galería de <span className="text-gradient-gold">Sucursal {neighborhood}</span>
              </h2>
              <p className="text-cream/60 text-xs sm:text-sm max-w-xl mx-auto mt-2">
                Fotografías reales del local, estación de trabajo y experiencia de servicio en esta ubicación.
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gallery.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6`}>
              {gallery.map((photo) => (
                <figure
                  key={photo.src}
                  className="border border-gold/25 bg-brown-medium/30 p-2.5 overflow-hidden group hover:border-gold/50 transition-all duration-300 retro-glow flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-brown-dark/60">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {photo.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-brown-dark/90 text-gold border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                        {photo.badge}
                      </span>
                    )}
                  </div>
                  <figcaption className="p-3 text-left">
                    <p className="font-serif text-sm font-semibold text-cream group-hover:text-gold transition-colors">
                      {photo.title}
                    </p>
                    <p className="text-cream/60 text-xs mt-1 leading-snug">
                      {photo.alt}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* SERVICIOS DISPONIBLES EN LA SUCURSAL */}
        <section aria-labelledby="services-title">
          <div className="text-center mb-10">
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Precios y Servicios</span>
            <h2 id="services-title" className="font-serif text-3xl sm:text-4xl text-cream mt-2">
              Servicios en <span className="text-gradient-gold">{neighborhood}</span>
            </h2>
            <p className="text-cream/60 text-sm max-w-xl mx-auto mt-2">
              Misma calidad, mismo profesionalismo y las técnicas más modernas en cada corte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {standardServices.map((svc) => (
              <div
                key={svc.name}
                className="border border-gold/20 bg-brown-medium/30 p-6 flex flex-col justify-between hover:border-gold/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <svc.icon className="w-5 h-5 text-gold" aria-hidden="true" />
                    <span className="font-serif text-xl font-bold text-gold">{svc.price} <span className="text-xs font-sans text-cream/50">MXN</span></span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-cream mb-2">{svc.name}</h3>
                  <p className="text-cream/60 text-xs leading-relaxed">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESEÑAS EN GOOGLE MAPS */}
        <section
          aria-labelledby="reviews-title"
          className="border border-gold/25 bg-gradient-to-b from-brown-medium/30 to-brown-dark p-7 sm:p-10 text-center"
        >
          <Star className="w-8 h-8 text-gold mx-auto mb-4" aria-hidden="true" />
          <h2 id="reviews-title" className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            Opiniones de Clientes en Google Maps
          </h2>
          <p className="text-cream/70 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
            Tu opinión nos impulsa a seguir mejorando. Consulta las calificaciones y comentarios reales de los clientes que han visitado la sucursal {neighborhood}, o deja tu propia experiencia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-gold text-brown-dark font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-gold-light transition-colors"
            >
              <span>Calificar en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href={branchMapsLink(branch)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 border border-gold/30 text-gold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors"
            >
              <span>Ver Ubicación en Maps</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES (LOCAL FAQ) */}
        <section aria-labelledby="faq-title">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.3em] uppercase">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>Preguntas Frecuentes</span>
            </div>
            <h2 id="faq-title" className="font-serif text-3xl sm:text-4xl text-cream mt-2">
              Dudas sobre la Sucursal {neighborhood}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gold/20 bg-brown-medium/20 p-6 rounded-none"
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

        {/* OTRAS SUCURSALES Y BARBER STUDIO */}
        <section aria-labelledby="other-branches-title" className="border-t border-gold/20 pt-12">
          <div className="text-center mb-8">
            <h2 id="other-branches-title" className="font-serif text-2xl sm:text-3xl text-cream">
              Otras Sucursales en <span className="text-gold">Huejutla</span>
            </h2>
            <p className="text-cream/60 text-xs sm:text-sm mt-1">
              Visita la sucursal más cercana o conoce nuestro exclusivo Barber Studio Carlyn VIP.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {otherBranches.map((other) => (
              <Link
                key={other.id}
                href={`/barberia-huejutla-${other.id}`}
                className="group border border-gold/20 bg-brown-medium/20 p-5 hover:border-gold/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-base font-bold text-cream group-hover:text-gold transition-colors">
                    {other.name}
                  </h3>
                  <p className="text-cream/60 text-xs mt-2 line-clamp-2">{other.address}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-xs text-gold">
                  <span>Ver sucursal</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}

            {/* Tarjeta destacada hacia Barber Studio Carlyn VIP */}
            <Link
              href="/barber-studio-jacarandas-huejutla"
              className="group border border-gold/40 bg-gradient-to-b from-brown-medium/50 to-brown-dark p-5 hover:border-gold transition-all flex flex-col justify-between retro-glow"
            >
              <div>
                <span className="text-[10px] text-gold uppercase tracking-wider font-bold">Servicios Especiales</span>
                <h3 className="font-serif text-base font-bold text-cream group-hover:text-gold transition-colors mt-1">
                  Barber Studio Carlyn VIP
                </h3>
                <p className="text-cream/60 text-xs mt-2">
                  Atención exclusiva por Carlyn en Jacarandas. Cortes premium y paquetes de autor.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-xs text-gold font-bold">
                <span>Conocer Barber Studio</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-gold/15 bg-brown-dark mt-16 py-8 text-center text-xs text-cream/40">
        <p>&copy; {new Date().getFullYear()} Barbería Carlyn. Huejutla de Reyes, Hidalgo.</p>
        <p className="mt-1">
          <Link href="/" className="text-gold hover:underline">Inicio</Link> · 
          <a href={branchMapsLink(branch)} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline ml-2">Google Maps</a>
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
