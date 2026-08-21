"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Nosotros", href: "#about" },
  { label: "Servicios", href: "#services" },
  { label: "Sucursales", href: "#branches" },
  { label: "Redes", href: "#social" },
  { label: "Contacto", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-brown-dark/95 backdrop-blur-md shadow-lg shadow-gold/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logotipo */}
            <motion.a
              href="#hero"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Scissors className="w-7 h-7 text-gold rotate-[-30deg] group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-cream tracking-wide">
                  CARLYN
                </span>
                <span className="text-[10px] tracking-[0.3em] text-gold uppercase -mt-1">
                  VIP Barbería
                </span>
              </div>
            </motion.a>

            {/* Navegación de escritorio */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="relative text-sm font-light text-cream/80 hover:text-gold transition-colors duration-300 tracking-wider uppercase group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Botón CTA */}
            <motion.a
              href="https://wa.me/521234567890?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20Barbería%20Carlyn%20VIP"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="hidden md:flex items-center gap-2 bg-gold/10 border border-gold/40 text-gold px-5 py-2.5 text-sm tracking-wider uppercase hover:bg-gold hover:text-brown-dark transition-all duration-300"
            >
              Agendar Cita
            </motion.a>

            {/* Botón del menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-cream hover:text-gold transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-brown-dark/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-cream hover:text-gold transition-colors tracking-wider uppercase"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="https://wa.me/521234567890?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20Barbería%20Carlyn%20VIP"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 bg-gold text-brown-dark px-8 py-3 text-lg tracking-wider uppercase font-bold hover:bg-gold-light transition-colors"
            >
              Agendar Cita
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
