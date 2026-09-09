"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Capas de fondo */}
      <div className="absolute inset-0 bg-brown-dark" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 50%, rgba(200,164,90,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(200,164,90,0.15) 0%, transparent 50%)",
        }}
      />

      {/* Ornamentos decorativos de esquina */}
      <div className="absolute top-24 left-8 w-20 h-20 border-t border-l border-gold/20" />
      <div className="absolute top-24 right-8 w-20 h-20 border-t border-r border-gold/20" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-gold/20" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-gold/20" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Ornamento superior */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            Desde el corazón de la Huasteca Hidalguense
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
        </motion.div>

        {/* Identidad principal */}
        <h1 className="mb-6">
          <BrandLogo className="w-full max-w-[383px] mx-auto" preload />
        </h1>

        {/* Insignia VIP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gold/40" />
          <span className="text-gold text-sm sm:text-base tracking-[0.5em] uppercase font-light border border-gold/30 px-6 py-2">
            VIP
          </span>
          <div className="h-px w-12 bg-gold/40" />
        </motion.div>

        {/* Lema */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-cream/70 text-lg sm:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Donde el estilo no se improvisa…{" "}
          <span className="text-gold italic">se diseña.</span>
          <br />
          Una experiencia premium para el caballero moderno.
        </motion.p>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/barber-studio"
            className="group relative bg-gold text-brown-dark px-10 py-4 text-sm tracking-[0.2em] uppercase font-bold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
          >
            <span className="relative z-10 group-hover:text-brown-dark transition-colors">
              Agenda con Carlyn
            </span>
            <div className="absolute inset-0 bg-gold-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </a>
          <a
            href="#services"
            className="border border-gold/40 text-gold px-10 py-4 text-sm tracking-[0.2em] uppercase font-light hover:bg-gold/10 transition-all duration-300"
          >
            Ver Servicios
          </a>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gold/50 hover:text-gold transition-colors"
        >
          <span className="text-xs tracking-[0.3em] uppercase">Descubre</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
