"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Nosotros", href: "#about" },
  { label: "Servicios", href: "#services" },
  { label: "Sucursales", href: "#branches" },
  { label: "Redes", href: "#social" },
  { label: "Reseña", href: "#reviews" },
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
              <BrandLogo className="w-36 lg:w-40" />
            </motion.a>

            {/* Navegación de escritorio */}
            <div className="hidden lg:flex items-center gap-8">
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
              href="/barber-studio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="hidden lg:flex items-center gap-2 bg-gold/10 border border-gold/40 text-gold px-5 py-2.5 text-sm tracking-wider uppercase hover:bg-gold hover:text-brown-dark transition-all duration-300"
            >
              Agenda con Carlyn
            </motion.a>

            {/* Botón del menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-cream hover:text-gold transition-colors"
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
              href="/barber-studio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 bg-gold text-brown-dark px-8 py-3 text-lg tracking-wider uppercase font-bold hover:bg-gold-light transition-colors"
            >
              Agenda con Carlyn
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
