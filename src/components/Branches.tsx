"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { MapPin, Clock, UserRound, CalendarX, CalendarCheck, Star } from "lucide-react";

import { branches, branchMapsLink, studioMapsUrl } from "@/lib/branches";
import { branchReviews, studioReviewUrl } from "@/lib/reviews";

interface BranchCardData {
  id: string;
  name: string;
  address: string;
  barber: string;
  hours: string;
  appointmentNotice: string;
  isAppointmentRequired: boolean;
  mapsUrl: string;
  reviewsUrl: string;
  landingUrl: string;
  featured?: boolean;
}

const displayBranches: BranchCardData[] = [
  {
    id: "aviacion-civil",
    name: "Barbería Carlyn — Sucursal Aviación Civil",
    address: "Adolfo López Mateos 33, Aviación Civil, 43000 Huejutla de Reyes, Hgo.",
    barber: "Jael",
    hours: "Lunes a sábado: 9:00 AM - 8:00 PM",
    appointmentNotice: "Sin cita previa",
    isAppointmentRequired: false,
    mapsUrl: branchMapsLink(branches.find((b) => b.id === "aviacion-civil") || { mapsUrl: "https://maps.app.goo.gl/eFiFQdVjH1j1cmr86" }),
    reviewsUrl: branchReviews["aviacion-civil"]?.writeUrl || "https://maps.app.goo.gl/eFiFQdVjH1j1cmr86",
    landingUrl: "/barberia-huejutla-aviacion-civil",
    featured: false,
  },
  {
    id: "ex-glorieta",
    name: "Barbería Carlyn — Sucursal Ex-Glorieta",
    address: "Carretera Nacional México-Tampico Km 215 4, Santa Irene, 43000 Huejutla de Reyes, Hgo.",
    barber: "Johan y Chucky Barber",
    hours: "Lunes a Domingo: 9:00 AM - 9:00 PM",
    appointmentNotice: "Sin cita previa",
    isAppointmentRequired: false,
    mapsUrl: branchMapsLink(branches.find((b) => b.id === "ex-glorieta") || { mapsUrl: "https://maps.app.goo.gl/gXseXXVcrJTq7D7d8" }),
    reviewsUrl: branchReviews["ex-glorieta"]?.writeUrl || "https://maps.app.goo.gl/gXseXXVcrJTq7D7d8",
    landingUrl: "/barberia-huejutla-ex-glorieta",
    featured: false,
  },
  {
    id: "jacarandas",
    name: "Barber Studio Carlyn — Jacarandas",
    address: "Jacarandas, Huejutla de Reyes, Hgo.",
    barber: "Carlyn",
    hours: "Con cita previa / según agenda",
    appointmentNotice: "Con cita previa",
    isAppointmentRequired: true,
    mapsUrl: studioMapsUrl,
    reviewsUrl: studioReviewUrl,
    landingUrl: "/barber-studio-jacarandas-huejutla",
    featured: false,
  },
];

export default function Branches() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="branches" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-brown" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(200,164,90,0.3) 0%, transparent 50%)",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            Encuéntranos
          </span>
          <div className="retro-line mx-auto mt-3 mb-6" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">
            Nuestras <span className="text-gradient-gold">Sucursales</span>
          </h2>
          <p className="text-cream/50 font-light max-w-xl mx-auto">
            Visítanos en cualquiera de nuestras ubicaciones. Misma calidad, excelencia y dedicación en cada corte.
          </p>
        </motion.div>

        {/* Tarjetas de sucursales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {displayBranches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * i }}
              className="relative flex flex-col justify-between p-8 transition-all duration-500 group bg-brown-medium/30 border border-gold/20 hover:border-gold/40 retro-glow"
            >
              <div>
                <div className="mb-6">
                  <MapPin className="w-8 h-8 text-gold mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-cream mb-3 min-h-[56px] flex items-center">
                    {branch.name}
                  </h3>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <UserRound className="w-4 h-4 text-gold/60 mt-1 shrink-0" aria-hidden="true" />
                    <span className="text-cream/80 text-sm">
                      Atendido por: <strong className="text-gold">{branch.barber}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {branch.isAppointmentRequired ? (
                      <CalendarCheck className="w-4 h-4 text-gold/60 shrink-0" aria-hidden="true" />
                    ) : (
                      <CalendarX className="w-4 h-4 text-gold/60 shrink-0" aria-hidden="true" />
                    )}
                    <span className="text-cream/80 text-sm">{branch.appointmentNotice}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gold/60 mt-1 shrink-0" />
                    <span className="text-cream/60 text-sm leading-relaxed">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gold/60 shrink-0" />
                    <span className="text-cream/60 text-sm">{branch.hours}</span>
                  </div>
                </div>
              </div>

              {/* Acciones de la tarjeta */}
              <div className="mt-auto pt-6 border-t border-gold/15 flex flex-col gap-3">
                {/* 1. Vínculo de texto: Ver detalles de esta sucursal */}
                <div className="text-center py-1">
                  <Link
                    href={branch.landingUrl}
                    className="inline-block text-sm font-medium text-gold hover:text-gold-light underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    Ver detalles de esta sucursal &rarr;
                  </Link>
                </div>

                {/* 2. Botón: CÓMO LLEGAR */}
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Cómo llegar a ${branch.name} en Google Maps (abrir en nueva pestaña)`}
                  className="w-full min-h-[52px] px-5 py-3.5 border-2 border-gold text-gold font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm hover:bg-gold hover:text-brown-dark hover:shadow-lg hover:shadow-gold/20 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                >
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>CÓMO LLEGAR</span>
                </a>

                {/* 3. Botón: VER RESEÑAS */}
                <a
                  href={branch.reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver y calificar reseñas de ${branch.name} en Google Maps (abrir en nueva pestaña)`}
                  className="w-full min-h-[44px] px-4 py-2.5 border-2 border-gold/70 text-gold text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 hover:bg-gold/10 hover:border-gold hover:text-cream active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-all duration-300"
                >
                  <Star className="w-3.5 h-3.5 shrink-0 text-gold fill-gold/20" aria-hidden="true" />
                  <span>VER RESEÑAS</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
