"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, ArrowUp } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";

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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brown-dark border-t border-gold/10">
      {/* Pie principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Marca */}
          <div className="md:col-span-2">
            <BrandLogo className="w-60 mb-6" />
            <p className="text-cream/40 text-sm font-light leading-relaxed max-w-sm mb-6">
              Donde el estilo no se improvisa… se diseña. Más que una barbería,
              una experiencia premium para el caballero moderno.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/carlyn_barberia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-gold/20 text-cream/50 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/CarlynBarberiaVip/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-gold/20 text-cream/50 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-cream tracking-wider uppercase mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Inicio", href: "#hero" },
                { label: "Nosotros", href: "#about" },
                { label: "Servicios", href: "#services" },
                { label: "Sucursales", href: "#branches" },
                { label: "Redes Sociales", href: "#social" },
                { label: "Contacto", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cream/40 text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-cream tracking-wider uppercase mb-4">
              Contacto
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" />
                <span className="text-cream/40 text-sm">
                  Adolfo López Mateos 33, Huejutla de Reyes, Hgo.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold/50 shrink-0" />
                <span className="text-cream/40 text-sm">+52 771 261 3445</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            &copy; {currentYear} Barbería Carlyn VIP. Todos los derechos reservados.
          </p>
          <motion.a
            href="#hero"
            whileHover={{ y: -3 }}
            className="w-10 h-10 flex items-center justify-center border border-gold/20 text-gold/50 hover:text-gold hover:border-gold/40 transition-all duration-300"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
