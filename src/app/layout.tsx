import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barbería Carlyn VIP | Estilo y Tradición",
  description:
    "Barbería Carlyn VIP - Donde el estilo no se improvisa, se diseña. Cortes premium, experiencia VIP. Agenda tu cita por WhatsApp.",
  keywords: [
    "barbería",
    "Carlyn",
    "VIP",
    "cortes de cabello",
    "peluquería de hombres",
    "barbero",
  ],
  openGraph: {
    title: "Barbería Carlyn VIP",
    description: "Estilo y Tradición - Agenda tu cita ahora",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col noise-overlay">{children}</body>
    </html>
  );
}
