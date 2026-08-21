"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

const branches = [
  {
    name: "Carlyn VIP — Sucursal Principal",
    address: "Adolfo López Mateos 33, Aviación Civil, 43000 Huejutla de Reyes, Hgo.",
    phone: "+52 771 261 3445",
    hours: "Lun - Dom: 8:00 AM - 9:00 PM",
    mapUrl:
      "https://www.google.com/maps/search/Barberia+Carlyn+Adolfo+Lopez+Mateos+33+Huejutla",
    featured: true,
  },
  {
    name: "Carlyn VIP — Sucursal 2",
    address: "Dirección por confirmar",
    phone: "+52 123 456 7891",
    hours: "Lun - Dom: 9:00 AM - 8:00 PM",
    mapUrl: "#",
    featured: false,
  },
  {
    name: "Carlyn VIP — Sucursal 3",
    address: "Dirección por confirmar",
    phone: "+52 123 456 7892",
    hours: "Lun - Dom: 9:00 AM - 8:00 PM",
    mapUrl: "#",
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
              className={`relative p-8 transition-all duration-500 group ${
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
                  <MapPin className="w-4 h-4 text-gold/60 mt-1 shrink-0" />
                  <span className="text-cream/60 text-sm">{branch.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold/60 shrink-0" />
                  <span className="text-cream/60 text-sm">{branch.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold/60 shrink-0" />
                  <span className="text-cream/60 text-sm">{branch.hours}</span>
                </div>
              </div>

              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold text-sm hover:text-gold-light transition-colors group/link"
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
