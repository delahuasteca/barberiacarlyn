"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, ExternalLink, UserRound, CalendarX } from "lucide-react";

import { branches } from "@/lib/branches";

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
            Visítanos en cualquiera de nuestras ubicaciones. Misma calidad, mismo estilo VIP.
          </p>
        </motion.div>

        {/* Tarjetas de sucursales */}
        <div className="grid md:grid-cols-3 gap-6">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * i }}
              className={`relative flex flex-col p-8 transition-all duration-500 group ${
                branch.featured
                  ? "bg-gradient-to-b from-brown-medium/60 to-brown-dark/60 border border-gold/30 retro-glow"
                  : "bg-brown-medium/30 border border-gold/10 hover:border-gold/20"
              }`}
            >
              {branch.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-brown-dark text-[10px] tracking-wider uppercase font-bold px-4 py-1">
                  Principal
                </div>
              )}

              <div className="mb-6">
                <MapPin className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-serif text-xl font-semibold text-cream mb-3">
                  {branch.name}
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <UserRound className="w-4 h-4 text-gold/60 mt-1 shrink-0" aria-hidden="true" />
                  <span className="text-cream/80 text-sm">Atendido por: <strong className="text-gold">{branch.barber}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarX className="w-4 h-4 text-gold/60 shrink-0" aria-hidden="true" />
                  <span className="text-cream/80 text-sm">Sin cita previa</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold/60 mt-1 shrink-0" />
                  <span className="text-cream/60 text-sm">{branch.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold/60 shrink-0" />
                  <span className="text-cream/60 text-sm">{branch.hours}</span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                aria-label={`Ver ${branch.name} en Google Maps`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 text-gold text-sm hover:text-gold-light transition-colors group/link"
              >
                <span>Ver en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
