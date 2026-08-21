"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Scissors, SprayCan, Crown, Flame, Star, Droplets } from "lucide-react";

const services = [
  {
    icon: Scissors,
    name: "Corte Clásico",
    description: "Corte tradicional con técnicas modernas. Incluye lavado y estilizado.",
    price: "$120",
    popular: false,
  },
  {
    icon: Flame,
    name: "Corte + Barba",
    description: "Corte de cabello premium más perfilado y diseño de barba con navaja.",
    price: "$180",
    popular: true,
  },
  {
    icon: Crown,
    name: "Servicio VIP Completo",
    description:
      "Corte, barba, tratamiento capilar, toalla caliente, bebida premium y masaje.",
    price: "$350",
    popular: true,
  },
  {
    icon: SprayCan,
    name: "Diseño & Líneas",
    description: "Diseños personalizados, líneas y figuras artísticas con máquina.",
    price: "$80",
    popular: false,
  },
  {
    icon: Droplets,
    name: "Tratamiento Capilar",
    description: "Hidratación profunda, mascarilla y masaje craneal relajante.",
    price: "$150",
    popular: false,
  },
  {
    icon: Star,
    name: "Corte Infantil",
    description: "Corte especial para los más pequeños. Paciencia y diversión garantizada.",
    price: "$90",
    popular: false,
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-brown-dark" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(200,164,90,0.3) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(200,164,90,0.3) 0px, transparent 1px, transparent 60px)",
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
            Lo que ofrecemos
          </span>
          <div className="retro-line mx-auto mt-3 mb-6" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">
            Nuestros <span className="text-gradient-gold">Servicios</span>
          </h2>
          <p className="text-cream/50 font-light max-w-xl mx-auto">
            Cada servicio está diseñado para brindarte una experiencia única.
            Calidad premium en cada detalle.
          </p>
        </motion.div>

        {/* Tarjetas de servicios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className={`relative group p-8 transition-all duration-500 ${
                service.popular
                  ? "bg-gradient-to-br from-brown-medium/80 to-brown-warm/30 border border-gold/30 retro-glow"
                  : "bg-brown-medium/30 border border-gold/10 hover:border-gold/30"
              }`}
            >
              {/* Insignia popular */}
              {service.popular && (
                <div className="absolute top-4 right-4 bg-gold text-brown-dark text-[10px] tracking-wider uppercase font-bold px-3 py-1">
                  Popular
                </div>
              )}

              <div className="mb-5">
                <service.icon className="w-10 h-10 text-gold group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h3 className="font-serif text-xl font-semibold text-cream mb-2">
                {service.name}
              </h3>
              <p className="text-cream/50 text-sm font-light leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="flex items-end justify-between">
                <span className="text-3xl font-serif font-bold text-gold">
                  {service.price}
                </span>
                <span className="text-cream/30 text-xs">MXN</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nota */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center text-cream/30 text-sm mt-10 font-light"
        >
          * Los precios pueden variar según sucursal. Consulta disponibilidad.
        </motion.p>
      </div>
    </section>
  );
}
