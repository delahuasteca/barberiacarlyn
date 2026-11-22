import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Propietario | Barbería Carlyn",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brown-dark text-cream selection:bg-gold selection:text-brown-dark">
      {children}
    </div>
  );
}
