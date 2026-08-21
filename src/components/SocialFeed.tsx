"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const socialPosts = [
  {
    platform: "instagram",
    icon: InstagramIcon,
    username: "@carlyn_barberia",
    preview:
      "En Carlyn Barbería, cada cliente VIP recibe más que un servicio: vive una experiencia a su altura.",
    type: "Reel",
    date: "Reciente",
    url: "https://www.instagram.com/carlyn_barberia/",
  },
  {
    platform: "instagram",
    icon: InstagramIcon,
    username: "@carlyn_barberia",
    preview:
      "CORTE DE CABELLO PARA TODAS LAS EDADES. Asesoramiento, atención personalizada y privada.",
    type: "Post",
    date: "Reciente",
    url: "https://www.instagram.com/carlyn_barberia/",
  },
  {
    platform: "instagram",
    icon: InstagramIcon,
    username: "@carlyn_barberia",
    preview:
      "El ambiente sí importa: imagínate rodeado de personas que hablan de negocios, dinero, viajes.",
    type: "Reel",
    date: "Reciente",
    url: "https://www.instagram.com/carlyn_barberia/",
  },
  {
    platform: "facebook",
    icon: FacebookIcon,
    username: "Barberías Carlyn",
    preview:
      "Ponemos a tu disposición nuestro número de WhatsApp para agendar tu cita directamente.",
    type: "Post",
    date: "Reciente",
    url: "https://www.facebook.com/CarlynBarberiaVip/",
  },
  {
    platform: "instagram",
    icon: InstagramIcon,
    username: "@carlyn_barberia",
    preview:
      "Tu barbería de confianza. Un lugar para las generaciones. El estilo cambia, la confianza permanece.",
    type: "Reel",
    date: "Reciente",
    url: "https://www.instagram.com/carlyn_barberia/",
  },
  {
    platform: "facebook",
    icon: FacebookIcon,
    username: "Barberías Carlyn",
    preview:
      "Horario de servicio de 8am a 9pm. Un lugar muy especial para cada cliente VIP.",
    type: "Post",
    date: "Reciente",
    url: "https://www.facebook.com/CarlynBarberiaVip/",
  },
];

export default function SocialFeed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="social" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-brown-dark" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">
            Síguenos
          </span>
          <div className="retro-line mx-auto mt-3 mb-6" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">
            Nuestras <span className="text-gradient-gold">Redes Sociales</span>
          </h2>
          <p className="text-cream/50 font-light max-w-xl mx-auto mb-8">
            Mantente al día con nuestros últimos trabajos, promociones y contenido exclusivo.
          </p>

          {/* Enlaces de redes sociales */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/carlyn_barberia/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brown-medium/50 border border-gold/20 px-5 py-2.5 text-cream/70 hover:text-gold hover:border-gold/40 transition-all duration-300 text-sm"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@carlyn_barberia</span>
            </a>
            <a
              href="https://www.facebook.com/CarlynBarberiaVip/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brown-medium/50 border border-gold/20 px-5 py-2.5 text-cream/70 hover:text-gold hover:border-gold/40 transition-all duration-300 text-sm"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Barberías Carlyn</span>
            </a>
          </div>
        </motion.div>

        {/* Cuadrícula de publicaciones */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {socialPosts.map((post, i) => (
            <motion.a
              key={i}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group bg-brown-medium/30 border border-gold/10 p-6 hover:border-gold/30 hover:bg-brown-medium/50 transition-all duration-500"
            >
              {/* Insignia de plataforma */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <post.icon
                    className={`w-4 h-4 ${
                      post.platform === "instagram"
                        ? "text-pink-400"
                        : "text-blue-400"
                    }`}
                  />
                  <span className="text-cream/40 text-xs">{post.username}</span>
                </div>
                <span className="text-gold/40 text-xs border border-gold/20 px-2 py-0.5">
                  {post.type}
                </span>
              </div>

              {/* Contenido */}
              <p className="text-cream/70 text-sm font-light leading-relaxed mb-4 group-hover:text-cream/90 transition-colors">
                &ldquo;{post.preview}&rdquo;
              </p>

              {/* Pie */}
              <div className="flex items-center justify-between">
                <span className="text-cream/30 text-xs">{post.date}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold/30 group-hover:text-gold transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
