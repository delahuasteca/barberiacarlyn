"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Clock, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Excelencia",
    description: "Barberos certificados con años de experiencia en las últimas tendencias.",
  },
  {
    icon: Clock,
    title: "Tu Tiempo Vale",
    description: "Sin demoras, atención personalizada.",
  },
  {
    icon: Users,
    title: "Ambientes pensados en Tí",
    description: "Un espacio exclusivo donde cada detalle está pensado para ti.",
  },
  {
    icon: Sparkles,
    title: "Premium",
    description: "Productos de primera calidad y técnicas de vanguardia.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-brown" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(200,164,90,0.4) 0%, transparent 50%)",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Izquierda - Texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
                Nuestra Historia
              </span>
              <div className="retro-line mt-3 mb-6" />
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-6 leading-tight">
                Más que una barbería,
                <br />
                <span className="text-gradient-gold">una experiencia</span>
              </h2>
              <p className="text-cream/60 text-lg font-light leading-relaxed mb-6">
                En <span className="text-gold font-medium">Barbería Carlyn VIP</span>,
                cada cliente recibe más que un servicio: vive una experiencia a su altura.
                Porque el estilo no se improvisa… se diseña con precisión, pasión y dedicación.
              </p>
              <p className="text-cream/50 font-light leading-relaxed mb-8">
                Contamos con un equipo de barberos profesionales que dominan las técnicas
                más modernas del mercado. Desde fades impecables hasta diseños personalizados,
                cada corte es una obra de arte. Disfruta de nuestro ambiente exclusivo con
                pantallas deportivas, bebidas premium y la mejor compañía.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-3xl font-serif font-bold text-gold">3+</span>
                  <p className="text-cream/50 text-xs tracking-wider uppercase mt-1">
                    Sucursales
                  </p>
                </div>
                <div className="w-px h-12 bg-gold/20" />
                <div className="text-center">
                  <span className="text-3xl font-serif font-bold text-gold">5K+</span>
                  <p className="text-cream/50 text-xs tracking-wider uppercase mt-1">
                    Clientes Satisfechos
                  </p>
                </div>
                <div className="w-px h-12 bg-gold/20" />
                <div className="text-center">
                  <span className="text-3xl font-serif font-bold text-gold">8+</span>
                  <p className="text-cream/50 text-xs tracking-wider uppercase mt-1">
                    Años de Experiencia
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Derecha - Tarjetas de características */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="vintage-border retro-glow bg-brown-medium/50 p-6 group hover:bg-brown-medium/80 transition-all duration-500"
              >
                <feature.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-lg font-semibold text-cream mb-2">
                  {feature.title}
                </h3>
                <p className="text-cream/50 text-sm font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
