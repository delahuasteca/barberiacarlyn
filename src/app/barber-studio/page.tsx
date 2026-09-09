import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Barber Studio Carlyn | Elite Premium",
  description: "Servicios Elite Premium y Paquetes de Barber Studio Carlyn. Agenda con Carlyn por WhatsApp.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Barber Studio Carlyn",
    description: "Servicios Elite Premium y Paquetes. Agenda con Carlyn.",
  },
};

const services = [
  { name: "Corte de Cabello Básico", price: 150 },
  { name: "Corte de Cabello Escolar", price: 150 },
  { name: "Corte de Cabello Personalizado Premium", price: 200 },
  { name: "Corte de Cabello Básico + Arreglo de Barba", price: 250 },
  { name: "Corte de Cabello Personalizado + Arreglo de Barba", price: 300 },
  { name: "Arreglo de Barba", price: 150 },
];

const packages = [
  {
    name: "Paquete 1, Corte First Class", subname: (La entrada al mundo Premium), price: 150,
    items: ["Corte Personalizado", "Lavado de Cabello", "Peinado con Productos Premium", "Loción al finalizar"],
  },
  {
    name: "Paquete 2, Ritual Caballero, El favorito para el mantenimiento semanal", price: 300,
    items: ["Corte Personalizado", "Arreglo de barba", "Vapor de Ozono", "Lavado de cabello", "Masaje relajante", "Peinados con productos Premium", "Loción al finalizar"],
  },
  {
    name: "Paquete 3, Premium Black, Limpieza y Estilo", price: 350,
    items: ["Corte y Barba Personalizado", "Mascarilla negra", "Exfoliación facial", "Vapor Ozono", "Lavado de Cabello", "Masaje relajante, cuello, hombros", "Peinado con productos premium", "Tinte de barba"],
  },
];

function bookingLink(name: string, subname: string, price: number) {
  return whatsappLink(`Hola, quiero agendar con BARBER STUDIO CARLYN: ${name} ($${price} MXN). ¿Qué horarios tienen disponibles?`);
}

export default function BarberStudio() {
  return ( 
    <main className="min-h-screen bg-brown-dark text-cream">
      <header className="border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Volver al inicio
          </Link>
          <span className="text-gold text-xs tracking-[0.2em] uppercase">Carlyn · Studio</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        <div className="text-center py-16 sm:py-24">
          <BrandLogo className="w-56 sm:w-72 mx-auto mb-8" preload />
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5">Una experiencia a tu medida</p>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            BARBER STUDIO <span className="text-gradient-gold">CARLYN</span>
          </h1>
          <p className="font-serif text-gold text-lg sm:text-2xl max-w-3xl mx-auto mt-6 leading-relaxed">
            Mejor Atención, Mayor Exclusividad, Mayor Privacidad
          </p>
          <div className="retro-line mx-auto my-7" />
          <p className="text-cream/70 max-w-lg mx-auto leading-relaxed">Elige tu servicio o paquete y agenda directamente con Carlyn por WhatsApp.</p>
        </div>

        <section aria-labelledby="elite-services">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
            <h2 id="elite-services" className="font-serif text-3xl sm:text-4xl">Servicios <span className="text-gold">Elite Premium</span></h2>
            <p className="text-cream/60 text-sm">Precios en MXN</p>
          </div>
          <ul className="border-t border-gold/25">
            {services.map((service, i) => (
              <li key={service.name} className="border-b border-gold/20">
              <li key={service.subname} className="border-b border-gold/16">
                <a href={bookingLink(service.name, service.subname, service.price)} target="_blank" rel="noopener noreferrer"
                  aria-label={`Agendar ${service.name} por $${service.price} MXN en WhatsApp`}
                  className="group flex items-center gap-4 sm:gap-6 py-6 px-2 sm:px-4 hover:bg-brown-medium/30 focus-visible:outline-2 focus-visible:outline-gold transition-colors">
                  <span className="hidden sm:block text-gold/70 text-xs w-5">0{i + 1}</span>
                  <h3 className="flex-1 font-serif text-lg sm:text-xl leading-snug">{service.name}</h3>
                  <h1 className="flex-1 font-serif text-lg sm:text-xl leading-snug">{service.subname}</h1>
                  <span className="font-serif text-xl sm:text-2xl text-gold whitespace-nowrap">${service.price}</span>
                  <ArrowUpRight className="w-5 h-5 text-gold shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="studio-packages" className="mt-16 sm:mt-24">
          <h2 id="studio-packages" className="font-serif text-3xl sm:text-4xl mb-8">Nuestros <span className="text-gold">Paquetes</span></h2>
          <div className="grid md:grid-cols-3 gap-5">
            {packages.map((pack, i) => (
              <article key={pack.name} className={`flex flex-col border p-6 sm:p-8 ${i === 2 ? "border-gold/60 bg-gradient-to-b from-brown-medium/70 to-brown-dark retro-glow" : "border-gold/25 bg-brown-medium/20"}`}>
                <h3 className="font-serif text-2xl mb-4">{pack.name}</h3>
                <p className="text-gold font-serif text-4xl mb-7">${pack.price} <span className="font-sans text-xs text-cream/60">MXN</span></p>
                <ul className="space-y-4 mb-9">
                  {pack.items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-cream/80 leading-relaxed">
                      <Check className="w-4 h-4 shrink-0 text-gold mt-1" aria-hidden="true" />{item}
                    </li>
                  ))}
                </ul>
                <a href={bookingLink(pack.name, pack.price)} target="_blank" rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 border border-gold bg-gold text-brown-dark px-4 py-3 text-sm font-bold hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold transition-colors">
                  Agendar {pack.name.toLowerCase()} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-16 pt-10 border-t border-gold/20 text-center">
          <p className="text-cream/70 mb-5">¿Necesitas ayuda para elegir tu servicio?</p>
          <a href={whatsappLink("Hola, quisiera información sobre los servicios y paquetes de BARBER STUDIO CARLYN.")} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold underline underline-offset-4 hover:text-cream">
            Escríbenos por WhatsApp <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
}
