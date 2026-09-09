"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const whatsappUrl =
    "https://wa.me/521234567890?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20Barbería%20Carlyn%20VIP";

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-brown" />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(200,164,90,0.3) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            Contáctanos
          </span>
          <div className="retro-line mx-auto mt-3 mb-6" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">
            Agenda tu <span className="text-gradient-gold">Cita</span>
          </h2>
          <p className="text-cream/50 font-light max-w-xl mx-auto">
            Reservar es fácil y rápido. Escríbenos por WhatsApp y un barbero profesional
            te atenderá de inmediato.
          </p>
        </motion.div>

        {/* Tarjeta de contacto */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="vintage-border retro-glow bg-brown-medium/40 p-10 sm:p-14"
        >
          <div className="grid sm:grid-cols-2 gap-10">
            {/* Izquierda - Información */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-cream font-serif font-semibold mb-1">Teléfono</h4>
                  <p className="text-cream/50 text-sm">+52 771 261 3445</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-cream font-serif font-semibold mb-1">Ubicación</h4>
                  <p className="text-cream/50 text-sm">
                    Adolfo López Mateos 33, Aviación Civil,
                    <br />
                    43000 Huejutla de Reyes, Hgo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-cream font-serif font-semibold mb-1">Horario</h4>
                  <p className="text-cream/50 text-sm">Lunes a sábado: 9:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 shrink-0">
                  <MessageCircle className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-cream font-serif font-semibold mb-1">WhatsApp</h4>
                  <p className="text-cream/50 text-sm">Respuesta inmediata</p>
                </div>
              </div>
            </div>

            {/* Derecha - Llamada a la acción */}
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-[#25D366]/20 flex items-center justify-center mb-6"
              >
                <MessageCircle className="w-10 h-10 text-[#25D366]" />
              </motion.div>

              <h3 className="font-serif text-2xl font-bold text-cream mb-3">
                ¿Listo para tu nuevo look?
              </h3>
              <p className="text-cream/50 text-sm mb-8">
                Haz clic en el botón de abajo y agenda tu cita al instante.
                ¡Te esperamos!
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 font-bold tracking-wider uppercase text-sm hover:bg-[#20bd5a] transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
